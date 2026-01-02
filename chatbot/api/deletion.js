export default function handler(req, res) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Data Deletion Instructions - Barangay Connect</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 40px 20px; background: #f9fafb; }
    h1 { color: #1a1a2e; margin-bottom: 20px; }
    h2 { color: #1a1a2e; margin: 30px 0 15px; font-size: 1.3em; }
    p, li { margin-bottom: 12px; }
    ol { padding-left: 25px; margin-bottom: 20px; }
    .contact { background: #e8f4f8; padding: 20px; border-radius: 8px; margin-top: 30px; }
  </style>
</head>
<body>
  <h1>Data Deletion Instructions</h1>
  <p>Barangay Connect respects your privacy and provides a simple way to request the deletion of your data collected through our Facebook Messenger chatbot.</p>

  <h2>How to Delete Your Data</h2>
  <p>If you wish to delete your user data from Barangay Connect, you can follow these steps:</p>
  <ol>
    <li>Go to your Facebook Profile's <strong>Settings & Privacy</strong> > <strong>Settings</strong>.</li>
    <li>Look for <strong>Apps and Websites</strong> and you will see all of the apps you have connected.</li>
    <li>Search for <strong>Barangay Connect</strong> in the search bar.</li>
    <li>Scroll and click <strong>Remove</strong>.</li>
    <li>Congratulations, you have successfully removed your app activities.</li>
  </ol>

  <h2>Manual Request</h2>
  <p>Alternatively, you may request manual data deletion by contacting us directly:</p>
  <ul>
    <li>Email us at the contact email provided in our Facebook App settings.</li>
    <li>Message our Facebook Page directly with the text "DELETE MY DATA".</li>
  </ul>

  <div class="contact">
    <h2>Contact Information</h2>
    <p>For any further questions regarding your data, please visit your local barangay office or contact our support team.</p>
  </div>
</body>
</html>
  `);
}
