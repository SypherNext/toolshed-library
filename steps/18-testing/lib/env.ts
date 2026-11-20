// One place that reads required settings, with an error that says exactly what is missing.
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`The setting ${name} is missing. Add it to your .env file.`);
  return value;
}
