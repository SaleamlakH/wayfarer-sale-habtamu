import { randomUUID } from "node:crypto";
import { prisma } from "./prisma.js";

interface SlotBookingInput {
  userId: string;
  seats: number;
}

export function createBookingDbSetup() {
  const categoryId = randomUUID();
  const placeId = randomUUID();
  const userA = { id: randomUUID(), name: `Booking Test A ${randomUUID()}` };
  const userB = { id: randomUUID(), name: `Booking Test B ${randomUUID()}` };
  const createdSlotIds: string[] = [];

  async function setup(): Promise<void> {
    await Promise.all([
      prisma.category.create({
        data: { id: categoryId, name: `Booking Test Category ${categoryId}` },
      }),
      prisma.user.createMany({
        data: [userA, userB],
      }),
    ]);

    await prisma.place.create({
      data: {
        id: placeId,
        name: `Booking Test Place ${placeId}`,
        categoryId,
        description: "Booking integration test place.",
        openingHours: "09:00-17:00",
      },
    });
  }

  async function createSlot(
    capacity: number,
    bookings: SlotBookingInput[] = [],
  ): Promise<string> {
    const slot = await prisma.tourSlot.create({
      data: {
        placeId,
        startsAt: new Date(Date.now() + createdSlotIds.length * 60_000),
        capacity,
        bookings: {
          create: bookings,
        },
      },
      select: { id: true },
    });

    createdSlotIds.push(slot.id);
    return slot.id;
  }

  async function getBookedSeats(slotId: string): Promise<number> {
    const aggregate = await prisma.booking.aggregate({
      where: { slotId },
      _sum: { seats: true },
    });

    return aggregate._sum.seats ?? 0;
  }

  function getBookingCount(slotId: string): Promise<number> {
    return prisma.booking.count({ where: { slotId } });
  }

  async function cleanup(): Promise<void> {
    await prisma.booking.deleteMany({
      where: { slotId: { in: createdSlotIds } },
    });

    await Promise.all([
      prisma.tourSlot.deleteMany({
        where: { id: { in: createdSlotIds } },
      }),
      prisma.user.deleteMany({
        where: { id: { in: [userA.id, userB.id] } },
      }),
    ]);

    await prisma.place.delete({ where: { id: placeId } });
    await prisma.category.delete({ where: { id: categoryId } });
  }

  function disconnect(): Promise<void> {
    return prisma.$disconnect();
  }

  return {
    userA,
    userB,
    setup,
    createSlot,
    getBookedSeats,
    getBookingCount,
    cleanup,
    disconnect,
  };
}
