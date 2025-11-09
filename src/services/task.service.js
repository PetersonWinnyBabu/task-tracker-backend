const db = require("../db/db.js");

const getTasks = (req, res) => {
  const { status, priority, sort_by = "due_date.asc" } = req.query;

  let dbquery = `SELECT * FROM tasks`;

  if (status) {
    dbquery += ` WHERE status = '${status}'`;
  }
  if (priority) {
    dbquery += status
      ? ` AND priority = '${priority}'`
      : ` WHERE priority = '${priority}'`;
  }
  if (sort_by === "due_date.asc") {
    dbquery += ` ORDER BY due_date ASC`;
  } else {
    dbquery += ` ORDER  BY due_date DESC`;
  }

  try {
    const tasks = db.prepare(dbquery).all();
    res.json(tasks);
  } catch (e) {
    res.json({ error: `Database Error ${e.message}` });
  }
};

const addTasks = (req, res) => {
  try {
    db.prepare(
      `INSERT INTO tasks (title, description, priority, due_date, status) VALUES (?, ?, ?, ?, ?)`
    ).run(
      req.body.title,
      req.body.description,
      req.body.priority,
      req.body.due_date,
      req.body.status
    );
    res.json({
      message: "Task Added Successfully",
    });
  } catch (e) {
    res.status(500).json({ error: `Error adding task ${e.message}` });
  }
};

const updateTasks = (req, res) => {
  const { id } = req.params;
  const { title, description, priority, due_date, status } = req.body;

  if (
    !title &&
    !description &&
    !priority &&
    !due_date &&
    status === undefined
  ) {
    return res.status(400).json({ error: "No fields to update" });
  }

  try {
    const colums = [];
    const values = [];

    if (title !== undefined) {
      colums.push("title = ?");
      values.push(title);
    }
    if (description !== undefined) {
      colums.push("description = ?");
      values.push(description);
    }
    if (priority !== undefined) {
      colums.push("priority = ?");
      values.push(priority);
    }
    if (due_date !== undefined) {
      colums.push("due_date = ?");
      values.push(due_date);
    }
    if (status !== undefined) {
      colums.push("status = ?");
      values.push(status);
    }

    const query = `UPDATE tasks SET ${colums.join(", ")} WHERE id = ?`;
    values.push(id);

    const result = db.prepare(query).run(...values);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    const updatedTask = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
    res.json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({ error: `Database Error ${error.message}` });
  }
};

const deleteTasks = (req, res) => {
  const { id } = req.params;
  try {
    const query = `DELETE from tasks WHERE id = ?`;

    db.prepare(query).run(id);
    res.json({
      message: "Task Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: `Database Error ${error.message}`,
    });
  }
};

module.exports = { getTasks, addTasks, updateTasks, deleteTasks };
