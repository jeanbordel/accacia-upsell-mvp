/**
 * Fulfillment notification helpers
 * Sends notifications when orders are paid
 * 
 * TODO: Configure real email service (SendGrid, Resend, etc.)
 * TODO: Configure WhatsApp Business API if needed
 */

import { logger } from "./logger";

export interface NotificationPayload {
  orderId: string;
  hotelName: string;
  offerTitle: string;
  amountCents: number;
  currency: string;
  customerEmail?: string;
  customerPhone?: string;
  fulfillmentNotes?: string;
}

/**
 * Send email notification for paid order
 * Currently a stub - replace with real email service
 */
export async function sendOrderNotificationEmail(
  payload: NotificationPayload
): Promise<boolean> {
  const emailTo = process.env.NOTIFICATION_EMAIL;
  
  if (!emailTo) {
    logger.debug("Email notification skipped (NOTIFICATION_EMAIL not set)", {
      orderId: payload.orderId,
    });
    return false;
  }

  // TODO: Integrate with SendGrid, Resend, or other email service
  logger.info("📧 [STUB] Would send email notification", {
    to: emailTo,
    orderId: payload.orderId,
    offer: payload.offerTitle,
    amount: `${(payload.amountCents / 100).toFixed(2)} ${payload.currency}`,
  });

  // Example email structure:
  const emailContent = {
    to: emailTo,
    subject: `🎉 New Order: ${payload.offerTitle}`,
    text: `
New order received!

Order ID: ${payload.orderId}
Hotel: ${payload.hotelName}
Offer: ${payload.offerTitle}
Amount: ${(payload.amountCents / 100).toFixed(2)} ${payload.currency}

${payload.customerEmail ? `Customer Email: ${payload.customerEmail}` : ""}
${payload.customerPhone ? `Customer Phone: ${payload.customerPhone}` : ""}

${payload.fulfillmentNotes ? `Fulfillment Notes:\n${payload.fulfillmentNotes}` : ""}

View order: ${process.env.APP_URL}/admin/orders
    `.trim(),
  };

  logger.debug("Email payload (not sent - stub mode)", emailContent);

  // TODO: Replace with actual email sending logic
  // Example with Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send(emailContent);

  return true;
}

/**
 * Send WhatsApp notification for paid order
 * Currently a stub - requires WhatsApp Business API setup
 */
export async function sendOrderNotificationWhatsApp(
  payload: NotificationPayload
): Promise<boolean> {
  const whatsappWebhook = process.env.WHATSAPP_WEBHOOK_URL;
  const whatsappPhone = process.env.WHATSAPP_NOTIFICATION_PHONE;

  if (!whatsappWebhook || !whatsappPhone) {
    logger.debug(
      "WhatsApp notification skipped (WHATSAPP_WEBHOOK_URL or WHATSAPP_NOTIFICATION_PHONE not set)",
      { orderId: payload.orderId }
    );
    return false;
  }

  // TODO: Integrate with WhatsApp Business API or Twilio
  logger.info("💬 [STUB] Would send WhatsApp notification", {
    to: whatsappPhone,
    orderId: payload.orderId,
    offer: payload.offerTitle,
  });

  // Example webhook payload structure:
  const webhookPayload = {
    phone: whatsappPhone,
    message: `🎉 Comandă nouă!\n\nOfertă: ${payload.offerTitle}\nSumă: ${(payload.amountCents / 100).toFixed(2)} ${payload.currency}\nID: ${payload.orderId}`,
  };

  logger.debug("WhatsApp payload (not sent - stub mode)", webhookPayload);

  // TODO: Replace with actual WhatsApp API call
  // Example with Twilio:
  // await fetch(whatsappWebhook, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(webhookPayload),
  // });

  return true;
}

/**
 * Send all configured notifications for a paid order
 */
export async function notifyOrderPaid(
  payload: NotificationPayload
): Promise<void> {
  try {
    await Promise.allSettled([
      sendOrderNotificationEmail(payload),
      sendOrderNotificationWhatsApp(payload),
    ]);
  } catch (error) {
    logger.error(
      "Notification error",
      error instanceof Error ? error : new Error(String(error))
    );
  }
}
