// Vercel serverless function — adds a subscriber to Flodesk
// and assigns them to the configured segment.
// Requires FLODESK_API_KEY environment variable in Vercel.

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, first_name, last_name } = req.body || {};

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  const apiKey = process.env.FLODESK_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  const auth = 'Basic ' + Buffer.from(apiKey + ':').toString('base64');
  const SEGMENT_ID = '6340e5b00170f97cbdfc4b87';

  try {
    // Step 1: Create or update subscriber
    const subRes = await fetch('https://api.flodesk.com/v1/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json',
        'User-Agent': 'RIM-Website/1.0'
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        first_name: (first_name || '').trim(),
        last_name: (last_name || '').trim()
      })
    });

    if (!subRes.ok) {
      const err = await subRes.json().catch(() => ({}));
      return res.status(subRes.status).json({
        error: err.message || 'Could not add subscriber.'
      });
    }

    // Get the subscriber ID returned by Flodesk
    const subscriber = await subRes.json().catch(() => ({}));
    const subscriberId = subscriber.id || encodeURIComponent(email.trim().toLowerCase());

    // Step 2: Add to segment using subscriber ID
    const segRes = await fetch(
      `https://api.flodesk.com/v1/subscribers/${subscriberId}/segments`,
      {
        method: 'POST',
        headers: {
          'Authorization': auth,
          'Content-Type': 'application/json',
          'User-Agent': 'RIM-Website/1.0'
        },
        body: JSON.stringify({ segment_ids: [SEGMENT_ID] })
      }
    );

    if (!segRes.ok) {
      console.warn('Segment assignment failed:', subscriberId, await segRes.text());
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
};
