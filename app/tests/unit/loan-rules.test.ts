import { describe, expect, test } from "vitest";
import { availableMoves, canMakeMove } from "@/lib/loan-rules";

const request = { status: "requested" as const, ownerId: "member-asha", borrowerId: "member-dev" };

describe("loan moves", () => {
  test("the owner answers a request, the borrower may cancel it", () => {
    expect(availableMoves("member-asha", request)).toEqual(["approve", "decline"]);
    expect(availableMoves("member-dev", request)).toEqual(["cancel"]);
    expect(availableMoves("member-ben", request)).toEqual([]);
  });

  test("a borrower cannot approve their own request", () => {
    expect(canMakeMove("approve", "member-dev", request)).toBe(false);
  });

  test("a loan can only be returned once it was handed over", () => {
    expect(canMakeMove("markReturned", "member-asha", { ...request, status: "approved" })).toBe(false);
    expect(canMakeMove("markReturned", "member-asha", { ...request, status: "on_loan" })).toBe(true);
  });
});
