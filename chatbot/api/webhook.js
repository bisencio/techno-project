if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

export default async function handler(req, res) {
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

  // POST - Handle Messages
  if (req.method === 'POST') {
    const body = req.body;

    if (body.object === 'page') {
      for (const entry of body.entry) {
        if (!entry.messaging) continue;

        const event = entry.messaging[0];
        const senderId = event.sender.id;

        if (event.message?.text) {
          const text = event.message.text.trim();
          console.log(`Received message from ${senderId}: ${text}`);

          await handleMessage(senderId, text);
        }
      }
      return res.status(200).send('EVENT_RECEIVED');
    }
    return res.status(404).send('Not Found');
  }

  return res.status(405).send('Method Not Allowed');
}

async function handleMessage(senderId, text) {
  // Simple logic for now, can be expanded
  const response = `You said: "${text}"`;
  await sendMessage(senderId, response);
}

async function sendMessage(recipientId, messageText) {
  const url = `https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text: messageText },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('FB API Error:', data.error?.message || response.statusText);
    } else {
      console.log('Message sent successfully:', data.message_id);
    }
  } catch (error) {
    console.error('Network error sending message:', error.message);
  }
}