const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
let stripe = null;

if (STRIPE_SECRET_KEY) {
  stripe = require('stripe')(STRIPE_SECRET_KEY);
  console.log('[payments] Stripe initialized');
} else {
  console.warn('[payments] STRIPE_SECRET_KEY not set — payments disabled');
}

app.post('/api/create-checkout-session', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Payments are not configured yet.' });
  }

  try {
    const { name, amount, description, origin } = req.body;

    if (!name || !amount || amount < 50) {
      return res.status(400).json({ error: 'Invalid service or amount.' });
    }

    const baseOrigin = origin || req.headers.origin || 'https://sourfacemusic.github.io';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: name,
            description: description || undefined,
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: baseOrigin + '/?payment=success',
      cancel_url: baseOrigin + '/?payment=cancelled',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('[payments] Checkout error:', err.message);
    res.status(500).json({ error: 'Could not start checkout. Please try again or contact us.' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', payments: !!stripe });
});

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[payments] Server running on port ${PORT}`);
});
