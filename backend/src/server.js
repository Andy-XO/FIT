require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.get('/health', (_, res) => res.json({ ok: true }));

// Central error handler — keeps a thrown controller error from hanging a request.
app.use((err, _req, res, _next) => {
  console.error('API error:', err.message);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

connectDB().then(() => {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`API running on ${port}`));
});
