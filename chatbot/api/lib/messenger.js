if (process.env.NODE_ENV !== 'production') {
    const dotenv = await import('dotenv');
    dotenv.config();
}

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const FB_API_VERSION = 'v18.0';
const FB_API_URL = `https://graph.facebook.com/${FB_API_VERSION}`;

/**
 * Send a simple text message
 */
export async function sendTextMessage(recipientId, text, quickReplies = null) {
    const message = { text };
    if (quickReplies && Array.isArray(quickReplies) && quickReplies.length > 0) {
        message.quick_replies = quickReplies.map(qr => ({
            content_type: 'text',
            title: qr.title.substring(0, 20),
            payload: qr.payload,
        }));
    }
    return await callSendAPI(recipientId, message);
}

/**
 * Send a message with quick reply buttons
 */
export async function sendQuickReplies(recipientId, text, quickReplies) {
    const message = {
        text,
        quick_replies: quickReplies.map(qr => ({
            content_type: 'text',
            title: qr.title.substring(0, 20), // FB limit is 20 chars
            payload: qr.payload,
        })),
    };

    return await callSendAPI(recipientId, message);
}

/**
 * Send a generic template (card)
 */
export async function sendGenericTemplate(recipientId, elements, quickReplies = null) {
    const message = {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'generic',
                elements: elements.map(el => ({
                    title: el.title,
                    subtitle: el.subtitle,
                    image_url: el.imageUrl,
                    buttons: el.buttons?.map(btn => ({
                        type: btn.type || 'postback',
                        title: btn.title,
                        payload: btn.payload,
                        url: btn.url,
                    })),
                })),
            },
        },
    };

    if (quickReplies && Array.isArray(quickReplies) && quickReplies.length > 0) {
        message.quick_replies = quickReplies.map(qr => ({
            content_type: 'text',
            title: qr.title.substring(0, 20),
            payload: qr.payload,
        }));
    }

    return await callSendAPI(recipientId, message);
}

/**
 * Send a button template message (postback buttons)
 */
export async function sendButtonTemplate(recipientId, text, buttons, quickReplies = null) {
    const message = {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'button',
                text: text,
                buttons: buttons.slice(0, 3).map(btn => ({
                    type: btn.type || 'postback',
                    title: btn.title.substring(0, 20),
                    payload: btn.payload,
                    url: btn.url,
                })),
            },
        },
    };

    if (quickReplies && Array.isArray(quickReplies) && quickReplies.length > 0) {
        message.quick_replies = quickReplies.map(qr => ({
            content_type: 'text',
            title: qr.title.substring(0, 20),
            payload: qr.payload,
        }));
    }

    return await callSendAPI(recipientId, message);
}

/**
 * Send a booking confirmation message
 */
export async function sendBookingConfirmation(recipientId, booking) {
    const dateStr = new Date(booking.appointmentDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const timeStr = new Date(booking.appointmentDate).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });

    const confirmationText = `✅ Booking Confirmed!
━━━━━━━━━━━━━━━━━━
REFERENCE NUMBER
${booking.referenceNumber}
━━━━━━━━━━━━━━━━━━
${booking.serviceIcon} ${booking.serviceName}
📅 ${dateStr} at ${timeStr}
📍 Barangay Hall, ${booking.window}
📋 Please bring a valid ID`;

    return await sendTextMessage(recipientId, confirmationText, []);
}

/**
 * Send typing indicator
 */
export async function sendTypingOn(recipientId) {
    return await callSenderAction(recipientId, 'typing_on');
}

export async function sendTypingOff(recipientId) {
    return await callSenderAction(recipientId, 'typing_off');
}

/**
 * Core API call to send messages
 */
async function callSendAPI(recipientId, message) {
    const url = `${FB_API_URL}/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                recipient: { id: recipientId },
                message,
                messaging_type: 'RESPONSE',
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('FB API Error:', data.error?.message || response.statusText);
            return { success: false, error: data.error };
        }

        console.log('Message sent successfully:', data.message_id);
        return { success: true, messageId: data.message_id };
    } catch (error) {
        console.error('Network error sending message:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Send sender actions (typing indicator, mark seen, etc.)
 */
async function callSenderAction(recipientId, action) {
    const url = `${FB_API_URL}/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                recipient: { id: recipientId },
                sender_action: action,
            }),
        });
    } catch (error) {
        console.error('Error sending action:', error.message);
    }
}

/**
 * Set up the Get Started button and persistent menu
 */
export async function setupMessengerProfile() {
    const url = `${FB_API_URL}/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`;

    const profileData = {
        get_started: {
            payload: 'GET_STARTED',
        },
        persistent_menu: [
            {
                locale: 'default',
                composer_input_disabled: false,
                call_to_actions: [
                    {
                        type: 'postback',
                        title: '📅 New Appointment',
                        payload: 'NEW_APPOINTMENT',
                    },
                    {
                        type: 'postback',
                        title: '📋 My Appointments',
                        payload: 'MY_APPOINTMENTS',
                    },
                ],
            },
        ],
        greeting: [
            {
                locale: 'default',
                text: '👋 Magandang araw! Welcome to Barangay Connect. We are here to help you with barangay services. Tap Get Started to begin!',
            },
        ],
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Failed to set messenger profile:', data.error?.message);
            return { success: false, error: data.error };
        }

        console.log('Messenger profile set successfully');
        return { success: true };
    } catch (error) {
        console.error('Error setting messenger profile:', error.message);
        return { success: false, error: error.message };
    }
}
