export default async function handler(req, res) {
  // 1. Validate request method
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Please use POST.'
    });
  }

  try {
    // 2. Parse request body safely (Vercel automatically parses JSON body)
    const { name, email, skills, location, jobType } = req.body;

    // Optional: Basic validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required fields.'
      });
    }

    // 3. Log received data to console
    console.log('--- Webhook Received ---');
    console.log('Data:', { name, email, skills, location, jobType });

    // 4. Return JSON response
    return res.status(200).json({
      success: true,
      message: 'Webhook received successfully'
    });
    
  } catch (error) {
    // 5. Proper error handling
    console.error('Webhook Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while processing webhook.'
    });
  }
}
