if (process.env.NODE_ENV !== 'production') {
  const dotenv = await import('dotenv');
  dotenv.config();
}

import {
  sendTextMessage,
  sendQuickReplies,
  sendButtonTemplate,
  sendGenericTemplate,
  sendBookingConfirmation,
  sendTypingOn
} from './lib/messenger.js';

import {
  getSession,
  updateSession,
  clearSession,
  getServiceById,
  getServiceByName,
  getAppointmentByReference,
  getAppointmentsBySenderId,
} from './lib/models.js';

import {
  STEPS,
  initSession,
  getServicesButtons,
  getSlotsCards,
  getCancelButton,
  parseSlotFromPayload,
  processBooking,
  isValidPhoneNumber,
  formatPhoneNumber,
} from './lib/services.js';

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

export default async function handler(req, res) {
  // Handle webhook verification
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verified!');
      return res.status(200).send(challenge);
    }
    return res.status(403).send('Forbidden');
  }

  // Handle incoming messages
  if (req.method === 'POST') {
    const body = req.body;

    if (body.object === 'page') {
      for (const entry of body.entry) {
        if (!entry.messaging) continue;

        for (const event of entry.messaging) {
          const senderId = event.sender.id;

          try {
            // Handle Get Started button
            if (event.postback?.payload === 'GET_STARTED') {
              await handleGetStarted(senderId);
              continue;
            }

            // Handle other postbacks
            if (event.postback) {
              await handlePostback(senderId, event.postback.payload);
              continue;
            }

            // Handle quick reply (same as postback)
            if (event.message?.quick_reply) {
              await handlePostback(senderId, event.message.quick_reply.payload);
              continue;
            }

            // Handle text messages
            if (event.message?.text) {
              await handleTextMessage(senderId, event.message.text.trim());
              continue;
            }

            // Handle attachments (images, files, audio, video) - not supported
            if (event.message?.attachments) {
              await sendTextMessage(senderId, '⚠️ Sorry, I can only process text messages. Please type your response instead of sending images or files.');
              continue;
            }
          } catch (error) {
            console.error('Error processing message:', error);
            await sendTextMessage(senderId, 'Sorry, something went wrong. Please try again.');
          }
        }
      }
      return res.status(200).send('EVENT_RECEIVED');
    }
    return res.status(404).send('Not Found');
  }

  return res.status(405).send('Method Not Allowed');
}

/**
 * Handle Get Started button tap
 */
async function handleGetStarted(senderId) {
  await sendTypingOn(senderId);
  await clearSession(senderId);

  const welcomeText = `👋 Magandang araw! Welcome to Barangay Connect.

I can help you book appointments for barangay services. What would you like to do?`;

  await sendButtonTemplate(senderId, welcomeText, [
    { title: '📅 New Appointment', payload: 'NEW_APPOINTMENT' },
    { title: '📋 My Appointments', payload: 'MY_APPOINTMENTS' },
  ]);
}

/**
 * Handle postback buttons
 */
async function handlePostback(senderId, payload) {
  await sendTypingOn(senderId);

  switch (payload) {
    case 'NEW_APPOINTMENT':
      await initSession(senderId);
      await sendServiceSelection(senderId);
      break;

    case 'MY_APPOINTMENTS':
      await handleMyAppointments(senderId);
      break;

    case 'CANCEL':
      await clearSession(senderId);
      await sendTextMessage(senderId, '❌ Cancelled. Returning to main menu...', []);
      await handleGetStarted(senderId);
      break;

    default:
      // Handle service selection from postback
      if (payload.startsWith('SERVICE_')) {
        await handleServiceSelection(senderId, payload);
      } else if (payload.startsWith('SLOT_')) {
        await handleSlotSelection(senderId, payload);
      }
  }
}

/**
 * Send service selection as a single carousel with all services
 */
async function sendServiceSelection(senderId) {
  const buttons = getServicesButtons();

  // Create generic template elements for all services
  const serviceCards = buttons.map(btn => ({
    title: btn.title,
    subtitle: 'Tap to select this service',
    imageUrl: btn.imageUrl,
    buttons: [{
      type: 'postback',
      title: 'Select',
      payload: btn.payload,
    }],
  }));

  await sendTextMessage(senderId, 'What service do you need?');
  await sendGenericTemplate(senderId, serviceCards, [getCancelButton()]);
}

/**
 * Handle My Appointments - show user's existing appointments
 */
async function handleMyAppointments(senderId) {
  const appointments = await getAppointmentsBySenderId(senderId);

  if (!appointments || appointments.length === 0) {
    await sendButtonTemplate(senderId, 'You don\'t have any appointments yet. Would you like to book one?', [
      { title: '📅 New Appointment', payload: 'NEW_APPOINTMENT' },
    ]);
    return;
  }

  const statusEmoji = {
    pending: '⏳',
    confirmed: '✅',
    completed: '✔️',
    cancelled: '❌',
  };

  let message = `📋 Your Appointments:\n━━━━━━━━━━━━━━━━━━\n`;

  for (const apt of appointments) {
    const dateStr = new Date(apt.appointmentDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const timeStr = new Date(apt.appointmentDate).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    message += `\n${statusEmoji[apt.status] || ''} ${apt.referenceNumber}\n${apt.service}\n${dateStr} at ${timeStr}\n`;
  }

  await sendTextMessage(senderId, message);

  await sendButtonTemplate(senderId, 'What would you like to do?', [
    { title: '📅 New Appointment', payload: 'NEW_APPOINTMENT' },
  ], []);
}



/**
 * Handle service selection
 */
async function handleServiceSelection(senderId, payload) {
  const serviceId = payload.replace('SERVICE_', '');
  const service = getServiceById(serviceId);

  if (!service) {
    await sendTextMessage(senderId, 'Sorry, that service is not available. Please try again.');
    return;
  }

  await updateSession(senderId, {
    step: STEPS.AWAITING_SLOT,
    selectedService: serviceId,
  });

  // Send slots as generic template cards
  const slotCards = getSlotsCards();
  await sendTextMessage(senderId, `Great choice! Select your preferred appointment slot for ${service.name}:`);
  await sendGenericTemplate(senderId, slotCards, [getCancelButton()]);
}

/**
 * Handle slot selection
 */
async function handleSlotSelection(senderId, payload) {
  const selectedDate = parseSlotFromPayload(payload);

  await updateSession(senderId, {
    step: STEPS.AWAITING_NAME,
    selectedSlot: selectedDate.toISOString(),
  });

  await sendTextMessage(senderId, 'Perfect! Just need a few details.\nWhat is your full name?', [getCancelButton()]);
}

/**
 * Handle text messages based on current step
 */
async function handleTextMessage(senderId, text) {
  await sendTypingOn(senderId);

  const session = await getSession(senderId);

  // If no session, start fresh
  if (!session || !session.step || session.step === STEPS.IDLE || text.toUpperCase() === 'RESET') {
    if (text.toUpperCase() === 'RESET') {
      await clearSession(senderId);
      await sendTextMessage(senderId, '🔄 Session reset successfully.');
    }

    // Check if they're trying to check a booking
    if (text.toUpperCase().startsWith('BRY-')) {
      await lookupBooking(senderId, text.toUpperCase());
      return;
    }

    // Check if they're selecting a service by name
    const service = getServiceByName(text);
    if (service) {
      await handleServiceSelection(senderId, `SERVICE_${service.id}`);
      return;
    }

    // Otherwise, show welcome message
    await handleGetStarted(senderId);
    return;
  }

  // Handle based on current step
  switch (session.step) {
    case STEPS.AWAITING_SERVICE:
      const service = getServiceByName(text);
      if (service) {
        await handleServiceSelection(senderId, `SERVICE_${service.id}`);
      } else {
        await sendServiceSelection(senderId);
      }
      break;

    case STEPS.AWAITING_SLOT:
      await sendTextMessage(senderId, 'Please tap one of the available time slots above.');
      break;

    case STEPS.AWAITING_NAME:
      await handleNameInput(senderId, text);
      break;

    case STEPS.AWAITING_PHONE:
      await handlePhoneInput(senderId, text);
      break;

    case STEPS.AWAITING_REFERENCE:
      await lookupBooking(senderId, text.toUpperCase());
      break;

    default:
      await handleGetStarted(senderId);
  }
}

/**
 * Handle name input
 */
async function handleNameInput(senderId, name) {
  if (name.length < 2) {
    await sendTextMessage(senderId, 'Please enter your full name (at least 2 characters):', [getCancelButton()]);
    return;
  }

  // Extract first name for personalized response
  const firstName = name.split(' ')[0];

  await updateSession(senderId, {
    step: STEPS.AWAITING_PHONE,
    fullName: name,
  });

  await sendTextMessage(senderId, `Thanks ${firstName}! What's your mobile number?`, [getCancelButton()]);
}

/**
 * Handle phone input and complete booking
 */
async function handlePhoneInput(senderId, phone) {
  if (!isValidPhoneNumber(phone)) {
    await sendTextMessage(senderId, 'Please enter a valid mobile number (e.g., 09171234567):', [getCancelButton()]);
    return;
  }

  // Get the current session
  const session = await getSession(senderId);

  // Update with phone number
  await updateSession(senderId, {
    phoneNumber: formatPhoneNumber(phone),
  });

  // Get updated session and process booking
  const updatedSession = await getSession(senderId);

  try {
    const booking = await processBooking(updatedSession);
    await sendBookingConfirmation(senderId, booking);

    // Show main menu buttons after confirmation
    await sendButtonTemplate(senderId, 'What would you like to do next?', [
      { title: '📅 New Appointment', payload: 'NEW_APPOINTMENT' },
      { title: '📋 My Appointments', payload: 'MY_APPOINTMENTS' },
    ], []);
  } catch (error) {
    console.error('Error creating booking:', error);
    await sendTextMessage(senderId, 'Sorry, there was an error creating your booking. Please try again.', []);
    await handleGetStarted(senderId);
  }
}

/**
 * Look up an existing booking by reference number
 */
async function lookupBooking(senderId, reference) {
  const appointment = await getAppointmentByReference(reference);

  if (!appointment) {
    await sendTextMessage(
      senderId,
      `Sorry, I couldn't find a booking with reference number ${reference}. Please check and try again.`
    );
    return;
  }

  const dateStr = new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const timeStr = new Date(appointment.appointmentDate).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const statusEmoji = {
    pending: '⏳',
    confirmed: '✅',
    completed: '✔️',
    cancelled: '❌',
  };

  await sendTextMessage(
    senderId,
    `📋 Booking Details
━━━━━━━━━━━━━━━━━━
Reference: ${appointment.referenceNumber}
Name: ${appointment.fullName}
Service: ${appointment.service}
Date: ${dateStr}
Time: ${timeStr}
Status: ${statusEmoji[appointment.status] || ''} ${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}`,
    []
  );
}