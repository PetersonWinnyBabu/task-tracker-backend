const Database = require("better-sqlite3");

const db = new Database("test-tracker.db");

const CreateTable = `
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT CHECK(priority IN ('Low', 'Medium', 'High')) NOT NULL DEFAULT 'Medium',
    due_date TEXT NOT NULL,
    status TEXT CHECK(status IN ('Open', 'In Progress', 'Done')) NOT NULL DEFAULT 'Open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`;

const initializeDB = () => {
  try {
    db.exec(CreateTable);
    console.log("Table created successfully");
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
  }
};

initializeDB();
module.exports = db;
