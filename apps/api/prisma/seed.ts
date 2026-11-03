import { prisma } from "../src/db/prisma.js";

interface ReviewSeed {
  userName: string;
  rating: number;
  body: string;
}

interface BookingSeed {
  userName: string;
  seats: number;
}

interface TourSlotSeed {
  startsAt: string;
  capacity: number;
  bookings: BookingSeed[];
}

interface PlaceSeed {
  name: string;
  description: string;
  openingHours: string;
  reviews: ReviewSeed[];
  tourSlots: TourSlotSeed[];
}

interface CategorySeed {
  name: string;
  places: PlaceSeed[];
}

const categories: CategorySeed[] = [
  {
    name: "History",
    places: [
      {
        name: "National Museum",
        description: "A museum covering the region's history and art.",
        openingHours: "08:30–17:30",
        reviews: [
          {
            userName: "Sara",
            rating: 5,
            body: "Excellent historical exhibits and a great experience.",
          },
          {
            userName: "Abel",
            rating: 5,
            body: "Very informative and worth visiting.",
          },
          {
            userName: "Liya",
            rating: 4,
            body: "Great museum, but some sections need more explanations.",
          },
        ],
        tourSlots: [
          {
            startsAt: "2026-11-07T09:00:00.000Z",
            capacity: 10,
            bookings: [
              { userName: "Sara", seats: 4 },
              { userName: "Abel", seats: 3 },
              { userName: "Liya", seats: 2 },
            ],
          },
          {
            startsAt: "2026-11-07T11:00:00.000Z",
            capacity: 10,
            bookings: [
              { userName: "Sara", seats: 4 },
              { userName: "Abel", seats: 3 },
              { userName: "Liya", seats: 3 },
            ],
          },
        ],
      },
      {
        name: "Red Terror Martyrs Memorial Museum",
        description:
          "A memorial museum documenting the victims of the Red Terror.",
        openingHours: "08:30–17:30",
        reviews: [
          {
            userName: "Sara",
            rating: 5,
            body: "A powerful and important place to visit.",
          },
          {
            userName: "Abel",
            rating: 4,
            body: "Well presented and educational.",
          },
        ],
        tourSlots: [],
      },
      {
        name: "Addis Ababa Museum",
        description:
          "A museum preserving the history and development of Addis Ababa.",
        openingHours: "09:00–17:00",
        reviews: [
          {
            userName: "Sara",
            rating: 5,
            body: "A well-organized and informative museum.",
          },
          {
            userName: "Abel",
            rating: 4,
            body: "A good place to learn about Addis Ababa.",
          },
          {
            userName: "Liya",
            rating: 4,
            body: "Interesting historical information.",
          },
        ],
        tourSlots: [],
      },
    ],
  },
  {
    name: "Culture",
    places: [
      {
        name: "Ethnological Museum",
        description:
          "A museum showcasing the cultures and traditions of Ethiopian peoples.",
        openingHours: "09:00–17:00",
        reviews: [
          {
            userName: "Abel",
            rating: 4,
            body: "A fascinating collection of Ethiopian culture.",
          },
          {
            userName: "Liya",
            rating: 4,
            body: "Very interesting exhibits.",
          },
          {
            userName: "Sara",
            rating: 3,
            body: "Interesting collection, but the layout was confusing.",
          },
        ],
        tourSlots: [
          {
            startsAt: "2026-11-08T10:00:00.000Z",
            capacity: 12,
            bookings: [],
          },
        ],
      },
    ],
  },
  {
    name: "Nature",
    places: [
      {
        name: "Entoto Park",
        description:
          "A large hillside park with trails, viewpoints, and fresh mountain air.",
        openingHours: "08:00–18:00",
        reviews: [
          {
            userName: "Sara",
            rating: 5,
            body: "Beautiful views and fresh air.",
          },
          {
            userName: "Abel",
            rating: 5,
            body: "Great place for spending time outdoors.",
          },
          {
            userName: "Liya",
            rating: 4,
            body: "Enjoyable, although some areas are crowded.",
          },
        ],
        tourSlots: [
          {
            startsAt: "2026-11-08T09:00:00.000Z",
            capacity: 8,
            bookings: [
              { userName: "Sara", seats: 4 },
              { userName: "Liya", seats: 4 },
            ],
          },
          {
            startsAt: "2026-11-08T14:00:00.000Z",
            capacity: 10,
            bookings: [{ userName: "Abel", seats: 2 }],
          },
        ],
      },
      {
        name: "Unity Park",
        description:
          "A landscaped park featuring gardens, wildlife, and family attractions.",
        openingHours: "09:00–17:00",
        reviews: [
          {
            userName: "Abel",
            rating: 4,
            body: "A lovely place to explore.",
          },
          {
            userName: "Liya",
            rating: 4,
            body: "Well maintained and interesting.",
          },
          {
            userName: "Sara",
            rating: 3,
            body: "Nice scenery, but it felt crowded.",
          },
        ],
        tourSlots: [],
      },
    ],
  },
  {
    name: "Food",
    places: [
      {
        name: "Yod Abyssinia",
        description:
          "A cultural restaurant serving traditional Ethiopian food with live performances.",
        openingHours: "11:00–23:00",
        reviews: [
          {
            userName: "Sara",
            rating: 4,
            body: "Great traditional food and cultural performances.",
          },
          {
            userName: "Abel",
            rating: 5,
            body: "Excellent food and atmosphere.",
          },
          {
            userName: "Liya",
            rating: 3,
            body: "The performances were good, but the service was slow.",
          },
        ],
        tourSlots: [],
      },
      {
        name: "Tomoca Coffee",
        description:
          "A historic coffee house known for its freshly roasted Ethiopian coffee.",
        openingHours: "07:00–20:00",
        reviews: [
          {
            userName: "Liya",
            rating: 5,
            body: "Excellent Ethiopian coffee.",
          },
        ],
        tourSlots: [],
      },
    ],
  },
  {
    name: "Landmark",
    places: [
      {
        name: "Holy Trinity Cathedral",
        description:
          "A historic cathedral known for its architecture and religious significance.",
        openingHours: "08:00–17:00",
        reviews: [
          {
            userName: "Sara",
            rating: 5,
            body: "Beautiful architecture and peaceful surroundings.",
          },
          {
            userName: "Liya",
            rating: 4,
            body: "A remarkable historical and religious landmark.",
          },
          {
            userName: "Abel",
            rating: 3,
            body: "Beautiful building, but the visit was too brief.",
          },
        ],
        tourSlots: [
          {
            startsAt: "2026-11-07T10:00:00.000Z",
            capacity: 10,
            bookings: [
              { userName: "Sara", seats: 4 },
              { userName: "Abel", seats: 2 },
            ],
          },
        ],
      },
      {
        name: "Meskel Square",
        description:
          "A central public square used for gatherings and national celebrations.",
        openingHours: "00:00–23:59",
        reviews: [
          {
            userName: "Sara",
            rating: 4,
            body: "An important central landmark.",
          },
          {
            userName: "Abel",
            rating: 3,
            body: "A central location, but not much to see.",
          },
          {
            userName: "Liya",
            rating: 3,
            body: "Busy and a bit underwhelming.",
          },
        ],
        tourSlots: [],
      },
    ],
  },
];

function getUserId(userIdByName: Map<string, string>, name: string): string {
  const userId = userIdByName.get(name);

  if (userId === undefined) {
    throw new Error(`Seed user not found: ${name}`);
  }

  return userId;
}

async function main() {
  await prisma.booking.deleteMany();
  await prisma.review.deleteMany();
  await prisma.tourSlot.deleteMany();
  await prisma.place.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const users = await prisma.user.createManyAndReturn({
    data: [{ name: "Sara" }, { name: "Abel" }, { name: "Liya" }],
    select: { id: true, name: true },
  });

  const userIdByName = new Map(users.map((user) => [user.name, user.id]));

  for (const category of categories) {
    await prisma.category.create({
      data: {
        name: category.name,
        places: {
          create: category.places.map((place) => ({
            name: place.name,
            description: place.description,
            openingHours: place.openingHours,
            reviews: {
              create: place.reviews.map((review) => ({
                userId: getUserId(userIdByName, review.userName),
                rating: review.rating,
                body: review.body,
              })),
            },
            tourSlots: {
              create: place.tourSlots.map((slot) => ({
                startsAt: new Date(slot.startsAt),
                capacity: slot.capacity,
                bookings: {
                  create: slot.bookings.map((booking) => ({
                    userId: getUserId(userIdByName, booking.userName),
                    seats: booking.seats,
                  })),
                },
              })),
            },
          })),
        },
      },
    });
  }

  console.log("Seed data created.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
