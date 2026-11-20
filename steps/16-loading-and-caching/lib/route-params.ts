// Ids arrive in the address as text ("/tools/7"). Only whole numbers above 0 are real ids.
export function parseId(text: string): number | null {
  if (!/^\d+$/.test(text)) return null;
  const id = Number(text);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}
