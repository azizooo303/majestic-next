/**
 * Odoo XML-RPC client — server-side only.
 *
 * Authenticates to majestic-furniture4.odoo.com and exposes a typed API
 * for reading Odoo records during sync operations.
 *
 * All credentials via environment variables:
 *   ODOO_URL, ODOO_DB, ODOO_UID, ODOO_KEY
 *
 * NEVER expose this module to the browser — it runs in API routes + Server Components only.
 */

// Minimal XML-RPC over fetch (Node.js runtime). No external deps.
// If we hit parsing edge cases, add the `xmlrpc` package.

const ODOO_URL = process.env.ODOO_URL || "";
const ODOO_DB = process.env.ODOO_DB || "";
const ODOO_UID = parseInt(process.env.ODOO_UID || "0", 10);
const ODOO_KEY = process.env.ODOO_KEY || "";

if (typeof window !== "undefined") {
  throw new Error("odoo-client must not be imported in client code");
}

interface OdooCallOptions {
  model: string;
  method: string;
  args?: unknown[];
  kwargs?: Record<string, unknown>;
}

// XML-RPC serializer — minimal, handles the subset Odoo needs
function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toXmlValue(v: unknown): string {
  if (v === null || v === undefined) {
    return "<value><nil/></value>";
  }
  if (typeof v === "boolean") {
    return `<value><boolean>${v ? 1 : 0}</boolean></value>`;
  }
  if (typeof v === "number") {
    if (Number.isInteger(v)) return `<value><int>${v}</int></value>`;
    return `<value><double>${v}</double></value>`;
  }
  if (typeof v === "string") {
    return `<value><string>${xmlEscape(v)}</string></value>`;
  }
  if (Array.isArray(v)) {
    const data = v.map(toXmlValue).join("");
    return `<value><array><data>${data}</data></array></value>`;
  }
  if (typeof v === "object") {
    const members = Object.entries(v as Record<string, unknown>)
      .map(
        ([k, val]) =>
          `<member><name>${xmlEscape(k)}</name>${toXmlValue(val)}</member>`,
      )
      .join("");
    return `<value><struct>${members}</struct></value>`;
  }
  throw new Error(`Unsupported XML-RPC value type: ${typeof v}`);
}

function buildCall(method: string, params: unknown[]): string {
  const paramsXml = params
    .map((p) => `<param>${toXmlValue(p)}</param>`)
    .join("");
  return `<?xml version="1.0"?>\n<methodCall><methodName>${method}</methodName><params>${paramsXml}</params></methodCall>`;
}

// XML-RPC parser — handles the responses Odoo produces
function parseXmlResponse(xml: string): unknown {
  // Detect fault
  const faultMatch = xml.match(
    /<fault>[\s\S]*?<name>faultString<\/name>[\s\S]*?<string>([\s\S]*?)<\/string>/,
  );
  if (faultMatch) {
    throw new Error(`Odoo XML-RPC fault: ${faultMatch[1]}`);
  }
  // Extract first <param><value>...</value></param>
  const paramMatch = xml.match(/<param>([\s\S]*?)<\/param>/);
  if (!paramMatch) throw new Error("Odoo response missing <param>");
  return parseValue(paramMatch[1]);
}

function parseValue(xml: string): unknown {
  const trimmed = xml.trim();
  // Strip outer <value>...</value> if present
  const valueMatch = trimmed.match(/^<value>([\s\S]*)<\/value>$/);
  const inner = valueMatch ? valueMatch[1].trim() : trimmed;
  // Handle each type
  if (inner.startsWith("<int>") || inner.startsWith("<i4>")) {
    const m = inner.match(/<(?:int|i4)>(-?\d+)<\/(?:int|i4)>/);
    return m ? parseInt(m[1], 10) : 0;
  }
  if (inner.startsWith("<double>")) {
    const m = inner.match(/<double>(-?[\d.eE+-]+)<\/double>/);
    return m ? parseFloat(m[1]) : 0;
  }
  if (inner.startsWith("<boolean>")) {
    const m = inner.match(/<boolean>([01])<\/boolean>/);
    return m ? m[1] === "1" : false;
  }
  if (inner.startsWith("<string>") || inner === "" || !inner.startsWith("<")) {
    const m = inner.match(/<string>([\s\S]*?)<\/string>/);
    return m ? m[1] : inner;
  }
  if (inner.startsWith("<nil")) return null;
  if (inner.startsWith("<array>")) {
    const dataMatch = inner.match(/<data>([\s\S]*)<\/data>/);
    if (!dataMatch) return [];
    const valueRegex = /<value>([\s\S]*?)<\/value>/g;
    const items: unknown[] = [];
    let m;
    while ((m = valueRegex.exec(dataMatch[1])) !== null) {
      // need to balance nested <value>; use depth parser for real cases
      items.push(parseValue(`<value>${m[1]}</value>`));
    }
    return items;
  }
  if (inner.startsWith("<struct>")) {
    const memberRegex =
      /<member>\s*<name>([\s\S]*?)<\/name>\s*([\s\S]*?)<\/member>/g;
    const obj: Record<string, unknown> = {};
    let m;
    while ((m = memberRegex.exec(inner)) !== null) {
      obj[m[1]] = parseValue(m[2].trim());
    }
    return obj;
  }
  return inner;
}

export async function odooCall<T = unknown>({
  model,
  method,
  args = [],
  kwargs = {},
}: OdooCallOptions): Promise<T> {
  if (!ODOO_URL || !ODOO_DB || !ODOO_UID || !ODOO_KEY) {
    throw new Error(
      "Odoo credentials missing. Set ODOO_URL, ODOO_DB, ODOO_UID, ODOO_KEY in environment.",
    );
  }

  const body = buildCall("execute_kw", [
    ODOO_DB,
    ODOO_UID,
    ODOO_KEY,
    model,
    method,
    args,
    kwargs,
  ]);

  const res = await fetch(`${ODOO_URL}/xmlrpc/2/object`, {
    method: "POST",
    headers: { "Content-Type": "text/xml" },
    body,
  });

  if (!res.ok) {
    throw new Error(`Odoo HTTP error: ${res.status} ${res.statusText}`);
  }

  const xml = await res.text();
  return parseXmlResponse(xml) as T;
}

// ── Convenience wrappers ─────────────────────────────────────────────────

export async function searchRead<T = Record<string, unknown>>(
  model: string,
  domain: unknown[] = [],
  fields?: string[],
  options: { limit?: number; offset?: number; order?: string } = {},
): Promise<T[]> {
  return odooCall<T[]>({
    model,
    method: "search_read",
    args: [domain],
    kwargs: {
      ...(fields && { fields }),
      ...options,
    },
  });
}

export async function read<T = Record<string, unknown>>(
  model: string,
  ids: number[],
  fields?: string[],
): Promise<T[]> {
  return odooCall<T[]>({
    model,
    method: "read",
    args: [ids],
    kwargs: fields ? { fields } : {},
  });
}

export async function searchCount(
  model: string,
  domain: unknown[] = [],
): Promise<number> {
  return odooCall<number>({
    model,
    method: "search_count",
    args: [domain],
  });
}

export async function ping(): Promise<boolean> {
  try {
    await odooCall({
      model: "res.users",
      method: "read",
      args: [ODOO_UID],
      kwargs: { fields: ["login"] },
    });
    return true;
  } catch {
    return false;
  }
}
