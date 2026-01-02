export default function handler(req, res) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Terms of Service - Barangay Connect</title>
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
  <h1>Terms of Service</h1>
  <p class="updated">Last updated: January 2, 2026</p>

  <p>Welcome to Barangay Connect. By using our Facebook Messenger chatbot, you agree to these Terms of Service.</p>

  <h2>Acceptance of Terms</h2>
  <p>By accessing or using Barangay Connect, you agree to be bound by these terms. If you do not agree, please do not use the service.</p>

  <h2>Description of Service</h2>
  <p>Barangay Connect is a chatbot that provides information about barangay services, announcements, and community resources. The service is provided free of charge to residents.</p>

  <h2>Acceptable Use</h2>
  <p>You agree not to:</p>
  <ul>
    <li>Use the service for any unlawful purpose</li>
    <li>Send spam, abusive, or threatening messages</li>
    <li>Attempt to disrupt or overload the service</li>
    <li>Impersonate others or provide false information</li>
  </ul>

  <h2>Disclaimer</h2>
  <p>The information provided by Barangay Connect is for general informational purposes only. While we strive for accuracy, we make no guarantees about the completeness or reliability of the information. For official matters, please visit your barangay hall in person.</p>

  <h2>Limitation of Liability</h2>
  <p>Barangay Connect and its operators shall not be liable for any damages arising from the use or inability to use this service.</p>

  <h2>Changes to Terms</h2>
  <p>We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the new terms.</p>

  <div class="contact">
    <h2>Contact Us</h2>
    <p>If you have questions about these Terms, please contact your local barangay office.</p>
  </div>
</body>
</html>
  `);
}
