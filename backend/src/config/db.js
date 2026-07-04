// No external database to connect to — persistence is the local JSON store
// (see ./store.js). Kept as an async no-op so server.js can await it unchanged.
const connectDB = async () => {
  console.log('Using local JSON store (backend/data/db.json) — no database server needed');
};

module.exports = connectDB;
