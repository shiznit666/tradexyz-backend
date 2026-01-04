const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const HYPERLIQUID_API = 'https://api.hyperliquid.xyz/info';

app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Trade.xyz Backend API'
  });
});

app.get('/api/meta', async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(HYPERLIQUID_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'meta' })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/prices', async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(HYPERLIQUID_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'allMids' })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/user/:address', async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const { address } = req.params;

    const response = await fetch(HYPERLIQUID_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        type: 'clearinghouseState',
        user: address.toLowerCase()
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/fills/:address', async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const { address } = req.params;

    const response = await fetch(HYPERLIQUID_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        type: 'userFills',
        user: address.toLowerCase()
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
