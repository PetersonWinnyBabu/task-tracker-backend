const express = require("express");
const router = express.Router();

const {
  getTasks,
  addTasks,
  updateTasks,
  deleteTasks,
} = require("../services/task.service.js");

const {getInsights} = require('../services/task.insights.js')

router.route("/tasks").get(getTasks).post(addTasks);
router.route("/tasks/:id").patch(updateTasks).delete(deleteTasks);
router.route("/insights").get(getInsights);
module.exports = router;
