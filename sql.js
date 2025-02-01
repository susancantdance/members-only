#! /usr/bin/env node

const { Client } = require("pg");
require("dotenv").config();

const SQL = `
CREATE TABLE IF NOT EXISTS username (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR ( 255 ) UNIQUE,
  password VARCHAR ( 255 ),
  firstname VARCHAR ( 255 ),
  lastname VARCHAR ( 255 ),
  membership BOOLEAN DEFAULT FALSE,
  admin BOOLEAN DEFAULT FALSE,
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  timestamp DATE,
  creator_id INTEGER,
  title VARCHAR ( 255 ),
  message VARCHAR ( 255 ),
);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
