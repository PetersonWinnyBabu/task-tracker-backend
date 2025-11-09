const db = require("../db/db.js");

const { addDays, format } = require("date-fns");

const getOpentasks = (status) => {
  const result = db
    .prepare(
      `SELECT COUNT(*) as count FROM tasks WHERE status like '${status}'`
    )
    .get();

  return result;
};

const getCountPriority = () => {
  const result = db
    .prepare(
      `SELECT DISTINCT priority,COUNT(*) as count FROM tasks GROUP BY priority`
    )
    .all();

  console.log(result);
  return result;
};
// getCountPriority();

const getDueSoon = () => {
  const today = format(Date(), "yyyy-MM-dd");
  const reqday = format(addDays(new Date(), 5), "yyyy-MM-dd");
  console.log(reqday);

  const result = db
    .prepare(
      `SELECT DISTINCT(priority),COUNT() as count FROM tasks WHERE due_date BETWEEN '${today}' AND '${reqday}' GROUP BY priority ORDER BY due_date DESC;`
    )
    .all();
  console.log(result);
  return result;
};

const getInsights = (req, res) => {
  const opentasks = getOpentasks("Open");
  const countPriority = getCountPriority();
  const dueSoon = getDueSoon();

  const insightObject = {
    opentasks,
    countPriority,
    dueSoon,
  };

  console.log({ opentasks, countPriority, dueSoon });

  res.json({
    message: "Here are the Insights",
    data: insightObject,
  });
};

module.exports = { getInsights };
