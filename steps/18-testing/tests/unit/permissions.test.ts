import { describe, expect, test } from "vitest";
import { canEditTool, canReserveTool } from "@/lib/permissions";

const ashasDrill = { ownerId: "member-asha" };
const asha = { id: "member-asha" };
const ben = { id: "member-ben" };

describe("who may do what with a tool", () => {
  test("only the owner may edit it", () => {
    expect(canEditTool(asha, ashasDrill)).toBe(true);
    expect(canEditTool(ben, ashasDrill)).toBe(false);
    expect(canEditTool(null, ashasDrill)).toBe(false);
  });

  test("anyone logged in except the owner may reserve it", () => {
    expect(canReserveTool(ben, ashasDrill)).toBe(true);
    expect(canReserveTool(asha, ashasDrill)).toBe(false);
    expect(canReserveTool(null, ashasDrill)).toBe(false);
  });
});
