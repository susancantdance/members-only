const { Client } = require("pg");
require("dotenv").config();

const SQL = `INSERT INTO messages (title, message, creator_id)
    VALUES ('hello','its me susan',2), ('meow','meow meow timmy', 3)`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  console.log("connected to " + process.env.DATABASE_URL);
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
