const pool = require("./pool.js");

//logout page XX
//write message (add timestamp) XX
//admin functionality
//delete functinality (admin only)
//club password page should be signed up only to become members XX

async function getMessages() {
  const messages = await pool.query("SELECT * FROM messages");
  return messages.rows;
}

async function getMemberMessages() {
  const messages = await pool.query(
    "SELECT messages.id AS id,title,message,timestamp,username.username AS author FROM messages JOIN username ON username.id = creator_id"
  );
  return messages.rows;
}

async function postSignup(user, pw, firstName, lastName, admin) {
  await pool.query(
    "INSERT INTO username (username, password, firstname, lastname, admin) values ($1, $2, $3, $4, $5)",
    [user, pw, firstName, lastName, admin]
  );
}

async function checkUserExists(username) {
  const { rows } = await pool.query(
    "SELECT * FROM username WHERE username = $1",
    [username]
  );
  return rows;
}

async function updateMembership(username) {
  await pool.query(
    "UPDATE username SET membership = true WHERE username = $1",
    [username]
  );
}

async function deserialize(id) {
  const { rows } = await pool.query("SELECT * FROM username WHERE id = $1", [
    id,
  ]);
  return rows;
}

async function postNewMsg(title, time, msg, userId) {
  await pool.query(
    "INSERT INTO messages (title, timestamp, message, creator_id) VALUES ($1,$2,$3,$4)",
    [title, time, msg, userId]
  );
}

async function deleteMsg(messageId) {
  await pool.query("DELETE FROM messages WHERE id = $1", [messageId]);
}

module.exports = {
  getMessages,
  getMemberMessages,
  postSignup,
  checkUserExists,
  deserialize,
  updateMembership,
  postNewMsg,
  deleteMsg,
};
