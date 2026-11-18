import { salonInfo } from '../data/salon-info';

export function getSalonWhatsAppNumber() {
  return salonInfo.whatsappNumber || process.env.NEXT_PUBLIC_SALON_WHATSAPP_NUMBER || '';
}

export function createWhatsAppLink(message?: string, whatsappNumber?: string) {
  const number = (whatsappNumber || getSalonWhatsAppNumber()).replace(/[^\dX]/g, '');
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${number}${query}`;
}

export function createBookingMessage({
  name,
  phone,
  side,
  service,
  date,
  message,
  salonName,
}: {
  name: string;
  phone: string;
  side?: string;
  service: string;
  date: string;
  message?: string;
  salonName?: string;
}) {
  return [
    `Hello ${salonName || salonInfo.name}, I want to book an appointment.`,
    '',
    `Name: ${name}`,
    `WhatsApp: ${phone}`,
    ...(side ? [`For: ${side}`] : []),
    `Service: ${service}`,
    `Date: ${date}`,
    `Message: ${message || '-'}`,
    '',
    'Please let me know a time that works.',
  ].join('\n');
}
