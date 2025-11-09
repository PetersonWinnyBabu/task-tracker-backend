const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const port = 3000;
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", require("./src/routes/task.routes.js"));
app.use(bodyParser.json());

// app.get("/insights", (req, res) => {
//   res.send("Hello World!");
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
