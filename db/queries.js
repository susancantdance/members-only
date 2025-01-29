const pool = require("./pool.js");

async function getMessages() {
  const messages = await pool.query("SELECT * FROM messages");
  return messages.rows;
}

async function getMemberMessages() {
  const messages = await pool.query(
    "SELECT messages.id AS id,title,message,timestamp,username.username AS username FROM messages JOIN username ON username.id = creator_id"
  );
  return messages.rows;
}

async function postSignup(user, pw) {
  await pool.query(
    "INSERT INTO username (username, password) values ($1, $2)",
    [user, pw]
  );
}

module.exports = {
  getMessages,
  getMemberMessages,
  postSignup,
};
