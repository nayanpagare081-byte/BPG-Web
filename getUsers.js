const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'dev.db');
const db = new Database(dbPath);

const users = db.prepare('SELECT id, email, role FROM User').all();
console.log(JSON.stringify(users, null, 2));
