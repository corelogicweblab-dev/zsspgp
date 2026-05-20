/** Parse API responses safely — avoids "Unexpected end of JSON input" on empty/HTML bodies. */
export async function parseApiJson<T extends Record<string, unknown> = Record<string, unknown>>(
  res: Response
): Promise<T> {
  const text = await res.text();
  if (!text.trim()) {
    if (!res.ok) {
      throw new Error(`Request failed (${res.status}). Check your connection and try again.`);
    }
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(
      res.ok
        ? "Invalid response from server."
        : `Request failed (${res.status}). The server did not return a valid response.`
    );
  }
}

export async function fetchApiJson<T extends Record<string, unknown> = Record<string, unknown>>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<{ res: Response; data: T }> {
  const res = await fetch(input, { credentials: "include", ...init });
  const data = await parseApiJson<T>(res);
  return { res, data };
}

export function friendlyPioDbError(message: string): string {
  if (message.includes("executive_orders") && message.includes("does not exist")) {
    return "Database table missing. Run database/migrations/015_pio_carousel_executive_orders.sql in Supabase.";
  }
  if (message.includes("executive-order-covers") || message.includes("Bucket not found")) {
    return "Storage bucket missing. Run database/migrations/015_pio_carousel_executive_orders.sql in Supabase.";
  }
  if (message.includes("row-level security")) {
    return "Permission denied. Set SUPABASE_SERVICE_ROLE_KEY on the server or sign in as Information Office admin.";
  }
  return message;
}
