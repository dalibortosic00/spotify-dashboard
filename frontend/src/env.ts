export function getEnvVar(key: string): string {
  const value = import.meta.env[key] as string | null;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}
