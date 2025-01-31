const pool = require("./pool.js");

//logout page
//write message (add timestamp)
//admin functionality
//delete functinality (admin only)
//club password page should be signed up only to become members

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

async function postSignup(user, pw) {
  await pool.query(
    "INSERT INTO username (username, password) values ($1, $2)",
    [user, pw]
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

module.exports = {
  getMessages,
  getMemberMessages,
  postSignup,
  checkUserExists,
  deserialize,
  updateMembership,
};
