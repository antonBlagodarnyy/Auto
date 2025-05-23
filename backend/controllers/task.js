const con = require("./connection");

exports.createTask = (req, res) => {
  const userId = req.body.userId;
  const content = req.body.content;
  const checked = req.body.checked;

  var sql = "insert into TASK (USER_ID, CONTENT, CHECKED) values (?,?,?);";

  con.query(sql, [userId, content, checked], (error, result) => {
    if (error) return res.status(520).json({ error: error.name });
    else {
      return res.status(201).json({
        task: {
          taskId: result.insertId,
          userId: userId,
          content: content,
          checked: checked,
        },
      });
    }
  });
};

exports.getTasks = (req, res) => {
  const userId = req.query.userId;

  var sql = "select * from TASK where USER_ID = ?";

  con.query(sql, [userId], (error, result) => {
    if (error) return res.status(520).json({ error: error.name });
    else {
      let tasks = [];
      result.forEach((e) => {
        tasks.push({
          taskId: e.ID,
          userId: e.USER_ID,
          content: e.CONTENT,
          checked: e.CHECKED,
        });
      });
      return res.status(201).json({
        results: tasks,
      });
    }
  });
};

exports.deleteTask = (req, res) => {
  const taskId = req.query.taskId;

  var sql = "delete  from TASK where ID = ?";

  con.query(sql, [taskId], (error) => {
    if (error) return res.status(520).json({ message: error.name });
    else {
      return res.status(201).json({ message: "Task deleted" });
    }
  });
};
exports.checkTask = (req, res) => {
  const taskId = req.body.taskId;
  const checked = req.body.checked;

  var sql = "update TASK set CHECKED = ? where ID = ?;";

  con.query(sql, [checked, taskId], (error, response) => {
    if (error) return res.status(520).json({ message: error.name });
    else
      return res.status(200).json({
        message: "Task updated",
      });
  });
};
