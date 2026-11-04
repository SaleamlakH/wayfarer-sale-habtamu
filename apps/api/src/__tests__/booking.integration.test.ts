import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app.js";
import { createBookingDbSetup } from "./db-setup/booking.js";

const db = createBookingDbSetup();
const { userA, userB } = db;

function book(slotId: string, userId: string, seats: number) {
  return request(app)
    .post(`/api/tour-slots/${slotId}/bookings`)
    .set("X-User-Id", userId)
    .send({ seats });
}

beforeAll(async () => {
  await db.setup();
});

afterAll(async () => {
  await db.cleanup();
  await db.disconnect();
});

describe("POST /api/tour-slots/:slotId/bookings concurrency", () => {
  it("allows exactly one of two concurrent requests for the last seat", async () => {
    const slotId = await db.createSlot(1);

    const responses = await Promise.all([
      book(slotId, userA.id, 1),
      book(slotId, userB.id, 1),
    ]);

    const created = responses.filter((response) => response.status === 201);
    const rejected = responses.filter((response) => response.status === 409);

    expect(created).toHaveLength(1);
    expect(rejected).toHaveLength(1);
    expect(rejected[0].body.error).toMatchObject({
      code: "INSUFFICIENT_CAPACITY",
      details: {
        requestedSeats: 1,
        availableSeats: 0,
      },
    });

    expect(created[0].body).toMatchObject({
      id: expect.any(String),
      slotId,
      seats: 1,
      createdAt: expect.any(String),
      tourSlot: {
        id: slotId,
        capacity: 1,
        bookedSeats: 1,
        remainingSeats: 0,
        isFull: true,
      },
    });

    expect(await db.getBookedSeats(slotId)).toBe(1);
    expect(await db.getBookingCount(slotId)).toBe(1);
  });

  it("allows one of two concurrent requests when both ask for more than half the capacity", async () => {
    const slotId = await db.createSlot(4);

    const responses = await Promise.all([
      book(slotId, userA.id, 3),
      book(slotId, userB.id, 3),
    ]);

    const created = responses.filter((response) => response.status === 201);
    const rejected = responses.filter((response) => response.status === 409);

    expect(created).toHaveLength(1);
    expect(rejected).toHaveLength(1);
    expect(rejected[0].body.error).toMatchObject({
      code: "INSUFFICIENT_CAPACITY",
      details: {
        requestedSeats: 3,
        availableSeats: 1,
      },
    });

    expect(created[0].body.seats).toBe(3);
    expect(created[0].body.tourSlot.remainingSeats).toBe(1);

    expect(await db.getBookedSeats(slotId)).toBe(3);
    expect(await db.getBookingCount(slotId)).toBe(1);
  });

  it("rejects an entire request that exceeds the available capacity", async () => {
    const slotId = await db.createSlot(5, [{ userId: userA.id, seats: 4 }]);

    const response = await book(slotId, userB.id, 2);

    expect(response.status).toBe(409);
    expect(response.body.error).toMatchObject({
      code: "INSUFFICIENT_CAPACITY",
      details: {
        requestedSeats: 2,
        availableSeats: 1,
      },
    });

    expect(await db.getBookedSeats(slotId)).toBe(4);
    expect(await db.getBookingCount(slotId)).toBe(1);
  });

  it("allows both concurrent requests when their combined seats fit", async () => {
    const slotId = await db.createSlot(4);

    const responses = await Promise.all([
      book(slotId, userA.id, 2),
      book(slotId, userB.id, 2),
    ]);

    const created = responses.filter((response) => response.status === 201);

    expect(created).toHaveLength(2);
    expect(
      responses.filter((response) => response.status === 409),
    ).toHaveLength(0);
    expect(created.map((response) => response.body.seats)).toEqual([2, 2]);
    expect(
      created
        .map((response) => response.body.tourSlot.remainingSeats)
        .sort((a, b) => a - b),
    ).toEqual([0, 2]);

    expect(await db.getBookedSeats(slotId)).toBe(4);
    expect(await db.getBookingCount(slotId)).toBe(2);
  });

  it("never overbooks under high contention", async () => {
    const slotId = await db.createSlot(6);

    const responses = await Promise.all(
      Array.from({ length: 9 }, (_, index) =>
        book(slotId, index % 2 === 0 ? userA.id : userB.id, 2),
      ),
    );

    const created = responses.filter((response) => response.status === 201);
    const rejected = responses.filter((response) => response.status === 409);

    expect(created).toHaveLength(3);
    expect(rejected).toHaveLength(6);

    for (const response of rejected) {
      expect(response.body.error).toMatchObject({
        code: "INSUFFICIENT_CAPACITY",
        details: {
          requestedSeats: 2,
          availableSeats: 0,
        },
      });
    }

    expect(
      created.reduce((total, response) => total + response.body.seats, 0),
    ).toBe(6);

    expect(await db.getBookedSeats(slotId)).toBe(6);
    expect(await db.getBookingCount(slotId)).toBe(3);
  });

  it("rejects a request against a fully booked slot", async () => {
    const slotId = await db.createSlot(2, [{ userId: userA.id, seats: 2 }]);

    const response = await book(slotId, userB.id, 1);

    expect(response.status).toBe(409);
    expect(response.body.error).toMatchObject({
      code: "INSUFFICIENT_CAPACITY",
      details: {
        requestedSeats: 1,
        availableSeats: 0,
      },
    });

    expect(await db.getBookedSeats(slotId)).toBe(2);
    expect(await db.getBookingCount(slotId)).toBe(1);
  });
});
