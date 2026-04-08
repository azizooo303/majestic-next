/**
 * Email Service — Majestic
 *
 * Lightweight email utility using Resend REST API (no npm package needed).
 * Gracefully degrades when RESEND_API_KEY is not set — logs a warning and returns.
 *
 * Environment variables:
 *   RESEND_API_KEY      — Resend API key (required for sending)
 *   EMAIL_FROM          — Sender address (default: "Majestic <noreply@majestic.com.sa>")
 *   NOTIFICATION_EMAIL  — Recipient for internal notifications (default: "info@majestic.com.sa")
 */

const RESEND_API_URL = "https://api.resend.com/emails";

function getApiKey(): string | undefined {
  return process.env.RESEND_API_KEY;
}

function getFromAddress(): string {
  return process.env.EMAIL_FROM ?? "Majestic <noreply@majestic.com.sa>";
}

function getNotificationEmail(): string {
  return process.env.NOTIFICATION_EMAIL ?? "info@majestic.com.sa";
}

// ── Types ────────────────────────────────────────────────────────────────────

interface ContactNotificationData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  locale?: string;
}

interface OrderConfirmationData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: ReadonlyArray<{ name: string; quantity: number; price: number }>;
  total: number;
  locale?: string;
}

interface QuotationNotificationData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  items: ReadonlyArray<{ name: string; quantity: number }>;
  notes?: string;
  locale?: string;
}

interface ResendPayload {
  from: string;
  to: string;
  subject: string;
  html: string;
}

interface ResendResponse {
  id?: string;
  message?: string;
}

// ── Internal helpers ─────────────────────────────────────────────────────────

async function sendEmail(payload: ResendPayload): Promise<ResendResponse | null> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping email send");
    return null;
  }

  const res = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`[email] Resend API ${res.status}: ${body}`);
    throw new Error(`Resend API error ${res.status}: ${body}`);
  }

  return (await res.json()) as ResendResponse;
}

function wrapHtml(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <div style="border-bottom:2px solid #0c0c0c;padding-bottom:16px;margin-bottom:32px;">
      <h1 style="margin:0;font-size:20px;font-weight:700;color:#0c0c0c;letter-spacing:-0.02em;">
        MAJESTIC
      </h1>
    </div>
    ${content}
    <div style="border-top:1px solid #e5e7eb;padding-top:24px;margin-top:40px;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">
        Majestic Furniture &mdash; Riyadh, Saudi Arabia
      </p>
    </div>
  </div>
</body>
</html>`.trim();
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Send an internal notification when a visitor submits the contact form.
 */
export async function sendContactNotification(data: ContactNotificationData): Promise<void> {
  const { name, email, phone, message, locale } = data;
  const isAr = locale === "ar";

  const subject = isAr
    ? `رسالة تواصل جديدة من ${name}`
    : `New contact message from ${name}`;

  const html = wrapHtml(`
    <h2 style="margin:0 0 16px;font-size:18px;font-weight:600;color:#0c0c0c;">
      ${isAr ? "رسالة تواصل جديدة" : "New Contact Message"}
    </h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;color:#0c0c0c;">
      <tr>
        <td style="padding:8px 0;font-weight:600;width:100px;">${isAr ? "الاسم" : "Name"}</td>
        <td style="padding:8px 0;">${escapeHtml(name)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;font-weight:600;">${isAr ? "البريد" : "Email"}</td>
        <td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#0c0c0c;">${escapeHtml(email)}</a></td>
      </tr>
      ${phone ? `<tr><td style="padding:8px 0;font-weight:600;">${isAr ? "الهاتف" : "Phone"}</td><td style="padding:8px 0;">${escapeHtml(phone)}</td></tr>` : ""}
    </table>
    <div style="margin-top:24px;padding:16px;background:#f9fafb;border-radius:4px;">
      <p style="margin:0;font-size:14px;color:#0c0c0c;white-space:pre-wrap;">${escapeHtml(message)}</p>
    </div>
  `);

  await sendEmail({
    from: getFromAddress(),
    to: getNotificationEmail(),
    subject,
    html,
  });
}

/**
 * Send an order confirmation email to the customer.
 */
export async function sendOrderConfirmation(data: OrderConfirmationData): Promise<void> {
  const { orderNumber, customerName, customerEmail, items, total, locale } = data;
  const isAr = locale === "ar";

  const subject = isAr
    ? `تأكيد طلبك #${orderNumber} — ماجستيك`
    : `Order Confirmation #${orderNumber} — Majestic`;

  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:14px;">${escapeHtml(item.name)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:14px;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:14px;text-align:right;">
          ${isAr ? `${item.price.toLocaleString("ar-SA")} ر.س` : `SAR ${item.price.toLocaleString("en-US")}`}
        </td>
      </tr>`
    )
    .join("");

  const html = wrapHtml(`
    <h2 style="margin:0 0 8px;font-size:18px;font-weight:600;color:#0c0c0c;">
      ${isAr ? "تأكيد الطلب" : "Order Confirmation"}
    </h2>
    <p style="margin:0 0 24px;font-size:14px;color:#484848;">
      ${isAr ? `شكراً ${escapeHtml(customerName)}، تم استلام طلبك رقم` : `Thank you ${escapeHtml(customerName)}, your order`}
      <strong>#${escapeHtml(orderNumber)}</strong>
      ${isAr ? "بنجاح." : "has been received."}
    </p>
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr style="background:#f9fafb;">
          <th style="padding:8px 12px;text-align:left;font-size:12px;text-transform:uppercase;color:#484848;font-weight:600;">${isAr ? "المنتج" : "Product"}</th>
          <th style="padding:8px 12px;text-align:center;font-size:12px;text-transform:uppercase;color:#484848;font-weight:600;">${isAr ? "الكمية" : "Qty"}</th>
          <th style="padding:8px 12px;text-align:right;font-size:12px;text-transform:uppercase;color:#484848;font-weight:600;">${isAr ? "السعر" : "Price"}</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding:12px;font-size:14px;font-weight:700;text-align:right;">${isAr ? "المجموع" : "Total"}</td>
          <td style="padding:12px;font-size:16px;font-weight:700;text-align:right;">
            ${isAr ? `${total.toLocaleString("ar-SA")} ر.س` : `SAR ${total.toLocaleString("en-US")}`}
          </td>
        </tr>
      </tfoot>
    </table>
  `);

  await sendEmail({
    from: getFromAddress(),
    to: customerEmail,
    subject,
    html,
  });
}

/**
 * Send an internal notification when a quotation request is submitted.
 */
export async function sendQuotationNotification(data: QuotationNotificationData): Promise<void> {
  const { name, email, phone, company, items, notes, locale } = data;
  const isAr = locale === "ar";

  const subject = isAr
    ? `طلب عرض سعر جديد من ${name}`
    : `New quotation request from ${name}`;

  const itemList = items
    .map(
      (item) =>
        `<li style="padding:4px 0;font-size:14px;">${escapeHtml(item.name)} &times; ${item.quantity}</li>`
    )
    .join("");

  const html = wrapHtml(`
    <h2 style="margin:0 0 16px;font-size:18px;font-weight:600;color:#0c0c0c;">
      ${isAr ? "طلب عرض سعر جديد" : "New Quotation Request"}
    </h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;color:#0c0c0c;">
      <tr>
        <td style="padding:8px 0;font-weight:600;width:100px;">${isAr ? "الاسم" : "Name"}</td>
        <td style="padding:8px 0;">${escapeHtml(name)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;font-weight:600;">${isAr ? "البريد" : "Email"}</td>
        <td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#0c0c0c;">${escapeHtml(email)}</a></td>
      </tr>
      ${phone ? `<tr><td style="padding:8px 0;font-weight:600;">${isAr ? "الهاتف" : "Phone"}</td><td style="padding:8px 0;">${escapeHtml(phone)}</td></tr>` : ""}
      ${company ? `<tr><td style="padding:8px 0;font-weight:600;">${isAr ? "الشركة" : "Company"}</td><td style="padding:8px 0;">${escapeHtml(company)}</td></tr>` : ""}
    </table>
    <h3 style="margin:24px 0 8px;font-size:14px;font-weight:600;color:#0c0c0c;">
      ${isAr ? "المنتجات المطلوبة" : "Requested Products"}
    </h3>
    <ul style="margin:0;padding:0 0 0 20px;">${itemList}</ul>
    ${notes ? `<div style="margin-top:24px;padding:16px;background:#f9fafb;border-radius:4px;"><p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#484848;">${isAr ? "ملاحظات" : "Notes"}</p><p style="margin:0;font-size:14px;color:#0c0c0c;white-space:pre-wrap;">${escapeHtml(notes)}</p></div>` : ""}
  `);

  await sendEmail({
    from: getFromAddress(),
    to: getNotificationEmail(),
    subject,
    html,
  });
}

// ── Utility ──────────────────────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
