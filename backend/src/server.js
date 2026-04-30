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

connectDB().then(() => {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`API running on ${port}`));
});
