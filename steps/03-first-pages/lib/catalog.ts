// The tools Toolshed knows about. For now they live in this file;
// a later lesson moves them into a PostgreSQL database.

export type Tool = {
  id: number;
  name: string;
  category: string;
  description: string;
  ownerName: string;
};

export const tools: Tool[] = [
  {
    id: 1,
    name: "Cordless drill",
    category: "Power tools",
    description: "18V drill with two batteries and a set of wood and masonry bits.",
    ownerName: "Asha",
  },
  {
    id: 2,
    name: "Extension ladder",
    category: "Ladders",
    description: "Reaches 6 metres. Good for gutters and first-floor windows.",
    ownerName: "Ben",
  },
  {
    id: 3,
    name: "Lawnmower",
    category: "Garden",
    description: "Petrol mower with a grass box. Fuel not included.",
    ownerName: "Chloe",
  },
];

export function findTool(id: number): Tool | undefined {
  return tools.find((tool) => tool.id === id);
}
