import {
    createAppointment,
    getSession,
    updateSession,
    clearSession,
    getServiceById,
    getServiceByName,
    SERVICES
} from './models.js';

/**
 * Generate available time slots for the next 7 days
 */
export function generateAvailableSlots() {
    const slots = [];
    const now = new Date();

    // Start from tomorrow
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() + 1);
    startDate.setHours(0, 0, 0, 0);

    // Generate slots for next 7 days
    for (let day = 0; day < 7; day++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + day);

        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) continue;

        // Morning slot: 9:00 AM
        const morningSlot = new Date(date);
        morningSlot.setHours(9, 0, 0, 0);
        slots.push(morningSlot);

        // Afternoon slot: 2:00 PM
        const afternoonSlot = new Date(date);
        afternoonSlot.setHours(14, 0, 0, 0);
        slots.push(afternoonSlot);
    }

    return slots.slice(0, 6); // Return max 6 slots for quick replies
}

/**
 * Format a date for display in quick reply
 */
export function formatSlotForDisplay(date) {
    const options = { month: 'short', day: 'numeric' };
    const dateStr = date.toLocaleDateString('en-US', options);
    const timeStr = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    return `${dateStr}, ${timeStr}`;
}

/**
 * Parse a slot string back to date
 */
export function parseSlotFromPayload(payload) {
    // payload format: SLOT_2024-01-15T09:00:00
    const dateStr = payload.replace('SLOT_', '');
    return new Date(dateStr);
}

/**
 * Get buttons for services (for button template - max 3 per message)
 */
export function getServicesButtons() {
    return SERVICES.map(service => ({
        title: `${service.icon} ${service.name.split(' ').slice(0, 2).join(' ')}`,
        payload: `SERVICE_${service.id}`,
        imageUrl: service.imageUrl,
    }));
}

/**
 * Get generic template cards for available slots
 */
export function getSlotsCards() {
    const slots = generateAvailableSlots();
    return slots.map(slot => ({
        title: `📅 ${formatSlotForDisplay(slot)}`,
        subtitle: slot.getHours() < 12 ? 'Morning slot' : 'Afternoon slot',
        buttons: [{
            type: 'postback',
            title: 'Select',
            payload: `SLOT_${slot.toISOString()}`,
        }],
    }));
}

/**
 * Get cancel button
 */
export function getCancelButton() {
    return {
        title: '❌ Cancel',
        payload: 'CANCEL',
    };
}

/**
 * Process a complete booking
 */
export async function processBooking(session) {
    const service = getServiceById(session.selectedService);

    const appointment = await createAppointment({
        senderId: session.senderId,
        service: service.name,
        appointmentDate: session.selectedSlot,
        fullName: session.fullName,
        phoneNumber: session.phoneNumber,
    });

    // Clear the session after booking
    await clearSession(session.senderId);

    return {
        ...appointment,
        serviceName: service.name,
        serviceIcon: service.icon,
        window: service.window,
    };
}

/**
 * Conversation steps
 */
export const STEPS = {
    IDLE: 'idle',
    AWAITING_SERVICE: 'awaiting_service',
    AWAITING_SLOT: 'awaiting_slot',
    AWAITING_NAME: 'awaiting_name',
    AWAITING_PHONE: 'awaiting_phone',
    AWAITING_REFERENCE: 'awaiting_reference',
};

/**
 * Initialize or reset a session
 */
export async function initSession(senderId) {
    return await updateSession(senderId, {
        step: STEPS.AWAITING_SERVICE,
        selectedService: null,
        selectedSlot: null,
        fullName: null,
        phoneNumber: null,
    });
}

/**
 * Validate phone number format
 */
export function isValidPhoneNumber(phone) {
    // Philippine mobile number format
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 13;
}

/**
 * Format phone number for storage
 */
export function formatPhoneNumber(phone) {
    return phone.replace(/\D/g, '');
}
