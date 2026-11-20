// Fake members, tools and loans for local development. Every email uses the reserved .test domain.
import type { CategorySlug } from "../lib/categories";
import type { ReservationStatus } from "../lib/reservation-status";

// Every seeded member can log in with this password. It is only for your own computer.
export const SEED_PASSWORD = "toolshed-demo-password";

export const seedMembers = [
  { id: "member-asha", name: "Asha Patel", email: "asha@toolshed.test" },
  { id: "member-ben", name: "Ben Okafor", email: "ben@toolshed.test" },
  { id: "member-chloe", name: "Chloe Martin", email: "chloe@toolshed.test" },
  { id: "member-dev", name: "Dev Sharma", email: "dev@toolshed.test" },
];

type SeedTool = {
  ownerId: string;
  name: string;
  category: CategorySlug;
  description: string;
  photo: string;
  available: boolean;
};

// Tool ids follow this order: the drill is tool 1, the tile cutter is tool 12.
export const seedTools: SeedTool[] = [
  { ownerId: "member-asha", name: "Cordless drill", category: "power-tools", photo: "cordless-drill", available: true,
    description: "18V drill with two batteries and a set of wood and masonry bits." },
  { ownerId: "member-ben", name: "Extension ladder", category: "ladders", photo: "extension-ladder", available: false,
    description: "Reaches 6 metres. Good for gutters and first-floor windows." },
  { ownerId: "member-chloe", name: "Lawnmower", category: "garden", photo: "lawnmower", available: true,
    description: "Petrol mower with a grass box. Fuel not included." },
  { ownerId: "member-asha", name: "Pressure washer", category: "cleaning", photo: "pressure-washer", available: true,
    description: "Cleans patios, fences and bikes. Comes with a 10 metre hose." },
  { ownerId: "member-dev", name: "Circular saw", category: "power-tools", photo: "circular-saw", available: true,
    description: "Corded saw with a fine and a rough blade. Safety glasses included." },
  { ownerId: "member-ben", name: "Hedge trimmer", category: "garden", photo: "hedge-trimmer", available: false,
    description: "Battery trimmer with a 50 cm blade. One charge does a long hedge." },
  { ownerId: "member-dev", name: "Step ladder", category: "ladders", photo: "step-ladder", available: true,
    description: "Five steps with a tool tray. Light enough to carry upstairs." },
  { ownerId: "member-chloe", name: "Socket set", category: "hand-tools", photo: "socket-set", available: true,
    description: "40 pieces in a case, metric sizes from 4 to 22 mm." },
  { ownerId: "member-asha", name: "Wheelbarrow", category: "garden", photo: "wheelbarrow", available: true,
    description: "Steel barrow with a puncture-proof tyre. Holds about 90 litres." },
  { ownerId: "member-ben", name: "Carpet cleaner", category: "cleaning", photo: "carpet-cleaner", available: true,
    description: "Upright cleaner with a hand tool for stairs. Bring your own shampoo." },
  { ownerId: "member-dev", name: "Spirit level", category: "hand-tools", photo: "spirit-level", available: true,
    description: "120 cm aluminium level with three vials." },
  { ownerId: "member-chloe", name: "Tile cutter", category: "hand-tools", photo: "tile-cutter", available: false,
    description: "Manual cutter for tiles up to 60 cm. Spare scoring wheel in the box." },
];

type SeedReservation = {
  toolId: number;
  borrowerId: string;
  // Days counted from the day you run the seed, so the demo always looks current.
  startInDays: number;
  endInDays: number;
  status: ReservationStatus;
};

export const seedReservations: SeedReservation[] = [
  // Out right now: these match the three tools seeded as "On loan".
  { toolId: 2, borrowerId: "member-dev", startInDays: -2, endInDays: 3, status: "on_loan" },
  { toolId: 6, borrowerId: "member-asha", startInDays: -1, endInDays: 1, status: "on_loan" },
  { toolId: 12, borrowerId: "member-ben", startInDays: -8, endInDays: -3, status: "on_loan" }, // overdue
  // Waiting for Asha to answer.
  { toolId: 4, borrowerId: "member-dev", startInDays: 3, endInDays: 4, status: "requested" },
  { toolId: 1, borrowerId: "member-ben", startInDays: 6, endInDays: 7, status: "approved" },
  // Finished, for the history page.
  { toolId: 1, borrowerId: "member-chloe", startInDays: -20, endInDays: -18, status: "returned" },
  { toolId: 3, borrowerId: "member-asha", startInDays: -12, endInDays: -11, status: "returned" },
  { toolId: 9, borrowerId: "member-dev", startInDays: -6, endInDays: -5, status: "declined" },
];
