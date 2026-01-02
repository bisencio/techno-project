export default function handler(req, res) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Policy - Barangay Connect</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 40px 20px; background: #f9fafb; }
    h1 { color: #1a1a2e; margin-bottom: 10px; }
    .updated { color: #666; font-size: 14px; margin-bottom: 30px; }
    h2 { color: #1a1a2e; margin: 30px 0 15px; font-size: 1.3em; }
    p, li { margin-bottom: 12px; }
    ul { padding-left: 25px; }
    .contact { background: #e8f4f8; padding: 20px; border-radius: 8px; margin-top: 30px; }
  </style>
</head>
<body>
  <h1>Privacy Policy</h1>
  <p class="updated">Last updated: January 2, 2026</p>

  <p>Barangay Connect ("we", "our", or "us") operates a Facebook Messenger chatbot designed to help residents access barangay services and information. This Privacy Policy explains how we collect, use, and protect your information.</p>

  <h2>Information We Collect</h2>
  <ul>
    <li><strong>Messages:</strong> We receive the messages you send to our chatbot through Facebook Messenger.</li>
    <li><strong>Profile Information:</strong> We may receive your Facebook public profile name and ID as provided by Facebook's Messenger Platform.</li>
  </ul>

  <h2>How We Use Your Information</h2>
  <ul>
    <li>To respond to your inquiries and provide barangay-related information</li>
    <li>To improve our chatbot services</li>
    <li>To communicate important announcements from the barangay</li>
  </ul>

  <h2>Data Sharing</h2>
  <p>We do not sell or share your personal information with third parties, except:</p>
  <ul>
    <li>When required by law or government request</li>
    <li>To protect the rights and safety of our community</li>
  </ul>

  <h2>Data Retention</h2>
  <p>We retain conversation data only as long as necessary to provide our services. You may request deletion of your data at any time.</p>

  <h2>Your Rights</h2>
  <p>You have the right to:</p>
  <ul>
    <li>Request access to your personal data</li>
    <li>Request correction or deletion of your data</li>
    <li>Stop using the chatbot at any time</li>
  </ul>

  <div class="contact">
    <h2>Contact Us</h2>
    <p>If you have questions about this Privacy Policy, please contact your local barangay office.</p>
  </div>
</body>
</html>
  `);
}
