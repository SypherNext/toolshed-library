// Fake members and tools for local development. Every email uses the reserved .test domain.
import type { CategorySlug } from "../lib/categories";

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
