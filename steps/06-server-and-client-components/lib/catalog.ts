// The tools Toolshed knows about. For now they live in this file;
// a later lesson moves them into a PostgreSQL database.
import type { CategorySlug } from "@/lib/categories";

export type Tool = {
  id: number;
  name: string;
  category: CategorySlug;
  description: string;
  ownerName: string;
  photo: string;
  available: boolean;
};

export const tools: Tool[] = [
  {
    id: 1,
    name: "Cordless drill",
    category: "power-tools",
    description: "18V drill with two batteries and a set of wood and masonry bits.",
    ownerName: "Asha",
    photo: "/seed-photos/cordless-drill.png",
    available: true,
  },
  {
    id: 2,
    name: "Extension ladder",
    category: "ladders",
    description: "Reaches 6 metres. Good for gutters and first-floor windows.",
    ownerName: "Ben",
    photo: "/seed-photos/extension-ladder.png",
    available: false,
  },
  {
    id: 3,
    name: "Lawnmower",
    category: "garden",
    description: "Petrol mower with a grass box. Fuel not included.",
    ownerName: "Chloe",
    photo: "/seed-photos/lawnmower.png",
    available: true,
  },
  {
    id: 4,
    name: "Pressure washer",
    category: "cleaning",
    description: "Cleans patios, fences and bikes. Comes with a 10 metre hose.",
    ownerName: "Asha",
    photo: "/seed-photos/pressure-washer.png",
    available: true,
  },
  {
    id: 5,
    name: "Circular saw",
    category: "power-tools",
    description: "Corded saw with a fine and a rough blade. Safety glasses included.",
    ownerName: "Dev",
    photo: "/seed-photos/circular-saw.png",
    available: true,
  },
  {
    id: 6,
    name: "Hedge trimmer",
    category: "garden",
    description: "Battery trimmer with a 50 cm blade. One charge does a long hedge.",
    ownerName: "Ben",
    photo: "/seed-photos/hedge-trimmer.png",
    available: false,
  },
  {
    id: 7,
    name: "Step ladder",
    category: "ladders",
    description: "Five steps with a tool tray. Light enough to carry upstairs.",
    ownerName: "Dev",
    photo: "/seed-photos/step-ladder.png",
    available: true,
  },
  {
    id: 8,
    name: "Socket set",
    category: "hand-tools",
    description: "40 pieces in a case, metric sizes from 4 to 22 mm.",
    ownerName: "Chloe",
    photo: "/seed-photos/socket-set.png",
    available: true,
  },
];

export function listTools(): Tool[] {
  return tools;
}

export function latestTools(count: number): Tool[] {
  return [...tools].sort((a, b) => b.id - a.id).slice(0, count);
}

export function findTool(id: number): Tool | undefined {
  return tools.find((tool) => tool.id === id);
}
