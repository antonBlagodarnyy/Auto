const con = require("./connection");

exports.createMeeting = (req, res) => {
  const userId = req.body.userId;
  const name = req.body.name;
  const day_of_meeting = req.body.dayOfMeeting;

  var sql = "insert into MEETING (USER_ID, DATE, NAME) (?,?,?);";

  con.query(sql, [userId, day_of_meeting, name], (error, result) => {
    if (error) return res.status(520).json({ error: error.name });
    else {
      return res.status(201).json({
        meeting: {
          id: result.insertId,
          userId: userId,
          dayOfMeeting: day_of_meeting,
        },
      });
    }
  });
};
