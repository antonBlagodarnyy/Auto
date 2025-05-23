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
          meetings[e.DAY_OF_MEETING] = [{ id: e.ID, name: e.NAME}];
        } else {
          meetings[e.DAY_OF_MEETING].push({ id: e.ID, name: e.NAME });
        }
      });

      return res.status(201).json({
        results: meetings,
      });
    }
  });
};
exports.deleteMeeting = (req, res) => {
  const id = req.query.meetingId;

  var sql = "delete from MEETING where ID = ?";

  con.query(sql, [id], (error, result) => {
    if (error) return res.status(520).json({ error: error.name });
    else {
      return res.status(201).json({ message: "meeting deleted" });
    }
  });
};

exports.updateMeeting = (req, res) => {
  const meetingId = req.body.meeting;
  const name = req.body.name;

  var sql = `update MEETING
     set NAME = ?
     where ID = ?`;

  con.query(sql, [name, meetingId], (error, result) => {
    if (error) return res.status(520).json({ error: error.name });
    else {
      return res.status(201).json({
        product: {
          id: result.insertId,
          name: name,
        },
      });
    }
  });
};
