// Who may do what. Plain functions with no database or framework code,
// so every rule is easy to read and easy to test.
type Member = { id: string } | null;
type OwnedTool = { ownerId: string };

export function isToolOwner(member: Member, tool: OwnedTool): boolean {
  return member !== null && member.id === tool.ownerId;
}

export function canEditTool(member: Member, tool: OwnedTool): boolean {
  return isToolOwner(member, tool);
}

export function canReserveTool(member: Member, tool: OwnedTool): boolean {
  return member !== null && !isToolOwner(member, tool);
}
