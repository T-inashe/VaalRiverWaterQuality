export type ClassValue =
  | string
  | number
  | null
  | undefined
  | boolean
  | Record<string, boolean>
  | ClassValue[];

function toClassString(input: ClassValue): string {
  if (!input) return "";
  if (typeof input === "string" || typeof input === "number") return String(input);
  if (Array.isArray(input)) return input.map(toClassString).filter(Boolean).join(" ");
  if (typeof input === "object") {
    return Object.entries(input)
      .filter(([, v]) => Boolean(v))
      .map(([k]) => k)
      .join(" ");
  }
  return "";
}

/**
 * Minimal `cn` helper compatible with shadcn/ui.
 * Joins class names, supports arrays and conditional objects.
 */
export function cn(...inputs: ClassValue[]): string {
  return inputs.map(toClassString).filter(Boolean).join(" ");
}
