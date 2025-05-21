const con = require("./connection");

exports.createMeeting = (req, res) => {
  const userId = req.body.userId;
  const name = req.body.name;
  const day_of_meeting = req.body.dayOfMeeting;
  console.log(day_of_meeting);
  var sql =
    "insert into MEETING (USER_ID, DAY_OF_MEETING, NAME) values (?,?,?);";

  con.query(sql, [userId, day_of_meeting, name], (error, result) => {
    if (error) return res.status(520).json({ error: error });
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

exports.getMeetings = (req, res) => {
  const userId = req.query.userId;

  var sql = "select * from MEETING where USER_ID=?";

  con.query(sql, [userId], (error, result) => {
    if (error) return res.status(520).json({ error: error.name });
    else {
      let meetings = {};
      result.forEach((e) => {
        if (!meetings[e.DAY_OF_MEETING]) {
          meetings[e.DAY_OF_MEETING] = [e.NAME];
        } else{
          meetings[e.DAY_OF_MEETING].push(e.NAME)
        }
      });
      console.log(meetings);
      return res.status(201).json({
        results: meetings,
      });
    }
  });
};
