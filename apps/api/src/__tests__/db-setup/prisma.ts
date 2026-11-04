import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client.js";

/*
 * Test-only Prisma client used to capture query-level logging. so this client 
 * enables it and groups each transaction's queries into one block:
 *
 * [booking slot=<slot-id>]
 *   lock     HH:mm:ss.SSS  X.Xms
 *   capacity HH:mm:ss.SSS  X.Xms  capacity=<n> booked=<n> available=<n>
 *   insert   HH:mm:ss.SSS  X.Xms  seats=<n>
 *
 * for concurrently occurend requests, the lock of the waiting happens 
 * before the insert mostly, this tells that the concurrency happens.
 * 
 * the other thing is, if the first request is succeed the available values
 * for the second waiting concurrent request will be lower than the first one.
 * this guarantees that the insert happen only after the first succeed.
 */

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString, max: 10 });

export const prisma = new PrismaClient({
  adapter,
  log: [{ emit: "event", level: "query" }],
});

prisma.$on("query", (event) => {
  const params = parseParams(event.params);

  if (event.query.includes('INSERT INTO "public"."tour_slots"')) {
    handleTourSlotInsert(event, params);
    return;
  }

  if (event.query.includes('INSERT INTO "public"."bookings"')) {
    handleBookingInsert(event, params);
    return;
  }

  if (event.query.includes("FOR UPDATE")) {
    handleLock(event);
    return;
  }

  if (event.query.includes('SELECT SUM("seats")')) {
    handleCapacityCheck(event);
  }
});

interface QueryEvent {
  query: string;
  params: string;
  timestamp: Date;
  duration: number;
}

interface BookingTransactionLog {
  slotId?: string;
  lock?: { timestamp: string; duration: number };
  capacity?: {
    timestamp: string;
    duration: number;
    capacity?: number;
    booked: number;
    available: number | "?";
  };
  insert?: { timestamp: string; duration: number; seats: number };
}

const slotCapacities = new Map<string, number>();
const slotBookedSeats = new Map<string, number>();
const transactionContext = new AsyncLocalStorage<string>();
const transactionLogs = new Map<string, BookingTransactionLog>();

function parseParams(params: string): unknown[] {
  try {
    const parsed = JSON.parse(params) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function handleTourSlotInsert(
  event: QueryEvent,
  params: unknown[],
): void {
  const slotId = getInsertedParam(event.query, params, "tour_slots", "id");
  const capacity = getInsertedParam(
    event.query,
    params,
    "tour_slots",
    "capacity",
  );

  if (typeof slotId === "string" && typeof capacity === "number") {
    slotCapacities.set(slotId, capacity);
  }
}

function handleBookingInsert(
  event: QueryEvent,
  params: unknown[],
): void {
  const slotId = getInsertedParam(event.query, params, "bookings", "slot_id");
  const seats = getInsertedParam(event.query, params, "bookings", "seats");

  if (typeof slotId !== "string" || typeof seats !== "number") {
    return;
  }

  slotBookedSeats.set(
    slotId,
    (slotBookedSeats.get(slotId) ?? 0) + seats,
  );

  const log = getTransactionLog();
  if (log) {
    log.insert = {
      timestamp: formatTimestamp(event.timestamp),
      duration: event.duration,
      seats,
    };
  }
}

function handleLock(event: QueryEvent): void {
  const slotId = getSlotId(event.params);
  const log = getTransactionLog();

  if (log) {
    log.slotId = slotId;
    log.lock = {
      timestamp: formatTimestamp(event.timestamp),
      duration: event.duration,
    };
    return;
  }

  console.log(
    `[lock ${formatTimestamp(event.timestamp)} ${event.duration.toFixed(1)}ms] slot=${slotId}`,
  );
}

function handleCapacityCheck(event: QueryEvent): void {
  const log = getTransactionLog();
  if (!log) {
    return;
  }

  const slotId = getSlotId(event.params);
  const capacity = slotCapacities.get(slotId);
  const booked = slotBookedSeats.get(slotId) ?? 0;

  log.capacity = {
    timestamp: formatTimestamp(event.timestamp),
    duration: event.duration,
    capacity,
    booked,
    available:
      capacity === undefined ? "?" : Math.max(capacity - booked, 0),
  };
}

function getTransactionLog(): BookingTransactionLog | undefined {
  const transactionId = transactionContext.getStore();
  return transactionId ? transactionLogs.get(transactionId) : undefined;
}

function formatTimestamp(timestamp: Date): string {
  return timestamp.toISOString().slice(11, 23);
}

function printTransactionLog(log: BookingTransactionLog): void {
  const lines = [`[booking slot=${log.slotId ?? "unknown"}]`];

  if (log.lock) {
    lines.push(
      `  lock     ${log.lock.timestamp}  ${log.lock.duration.toFixed(1)}ms`,
    );
  }

  if (log.capacity) {
    lines.push(
      `  capacity ${log.capacity.timestamp}  ${log.capacity.duration.toFixed(1)}ms  capacity=${log.capacity.capacity ?? "?"} booked=${log.capacity.booked} available=${log.capacity.available}`,
    );
  }

  if (log.insert) {
    lines.push(
      `  insert   ${log.insert.timestamp}  ${log.insert.duration.toFixed(1)}ms  seats=${log.insert.seats}`,
    );
  }

  console.log(lines.join("\n"));
}

function getInsertedParam(
  query: string,
  params: unknown[],
  table: string,
  column: string,
): unknown {
  const prefix = `INSERT INTO "public"."${table}" (`;
  const start = query.indexOf(prefix);
  if (start === -1) {
    return undefined;
  }

  const end = query.indexOf(")", start + prefix.length);
  if (end === -1) {
    return undefined;
  }

  const columns = query
    .slice(start + prefix.length, end)
    .split(",")
    .map((value) => value.trim().replace(/"/g, ""));
  const index = columns.indexOf(column);

  return index === -1 ? undefined : params[index];
}

function getSlotId(params: string): string {
  const [slotId] = parseParams(params);
  return typeof slotId === "string" ? slotId : "unknown";
}

function attachTransactionLogging(): void {
  const originalTransaction = prisma.$transaction;

  (prisma as unknown as { $transaction: typeof prisma.$transaction }).$transaction =
    ((...args: unknown[]) => {
      const transactionId = randomUUID();
      transactionLogs.set(transactionId, {});

      return transactionContext.run(transactionId, async () => {
        try {
          return await Reflect.apply(originalTransaction, prisma, args);
        } finally {
          flushTransactionLog(transactionId);
        }
      });
    }) as typeof prisma.$transaction;
}

function flushTransactionLog(transactionId: string): void {
  const log = transactionLogs.get(transactionId);
  transactionLogs.delete(transactionId);

  if (log?.lock) {
    printTransactionLog(log);
  }
}

attachTransactionLogging();
