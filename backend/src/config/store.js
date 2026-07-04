// Zero-setup persistence: a tiny JSON-file store that mirrors the handful of
// Mongoose methods the controllers use (create / findOne / findById / find /
// findOneAndUpdate). Data lives in backend/data/db.json and survives restarts.
// No database server to install — perfect for a single-user personal tracker.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

let db = null;

function ensure() {
  if (db) return;
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (fs.existsSync(DB_FILE)) {
    try {
      db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch {
      db = {};
    }
  } else {
    db = {};
  }
}

let saveTimer = null;
function persist() {
  // debounce writes so a burst of updates doesn't thrash the disk
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  }, 40);
}

function coll(name) {
  ensure();
  if (!db[name]) db[name] = [];
  return db[name];
}

function valueMatches(field, cond) {
  if (cond && typeof cond === 'object' && !Array.isArray(cond)) {
    return Object.entries(cond).every(([op, v]) => {
      if (op === '$gte') return field >= v;
      if (op === '$lte') return field <= v;
      if (op === '$gt') return field > v;
      if (op === '$lt') return field < v;
      if (op === '$ne') return String(field) !== String(v);
      return String(field) === String(v);
    });
  }
  return String(field) === String(cond);
}

function matches(doc, query) {
  return Object.entries(query).every(([k, v]) => valueMatches(doc[k], v));
}

function now() {
  return new Date().toISOString();
}

function collection(name) {
  const create = (obj) => {
    const c = coll(name);
    const _id = crypto.randomUUID();
    const doc = { _id, id: _id, ...obj, createdAt: now(), updatedAt: now() };
    c.push(doc);
    persist();
    return doc;
  };

  return {
    create,
    findOne(query) {
      return coll(name).find((d) => matches(d, query)) || null;
    },
    findById(id) {
      return coll(name).find((d) => String(d._id) === String(id)) || null;
    },
    find(query = {}) {
      const rows = coll(name).filter((d) => matches(d, query));
      // return a chainable-ish array with a no-op sort({field:dir}) like Mongoose
      rows.sort = (spec) => {
        const arr = [...rows];
        if (spec) {
          const [field, dir] = Object.entries(spec)[0];
          arr.sort((a, b) => (a[field] > b[field] ? 1 : -1) * (dir < 0 ? -1 : 1));
        }
        return arr;
      };
      return rows;
    },
    findOneAndUpdate(query, update, opts = {}) {
      const c = coll(name);
      const set = update.$set || update;
      let doc = c.find((d) => matches(d, query));
      if (!doc) {
        if (opts.upsert) return create({ ...query, ...set });
        return null;
      }
      Object.assign(doc, set);
      doc.updatedAt = now();
      persist();
      return doc;
    },
  };
}

module.exports = { collection };
