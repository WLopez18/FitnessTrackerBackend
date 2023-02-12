const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const { rows: [user] } = await client.query(`
    INSERT INTO users(username, password)
    VALUES($1, $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING id, username;
    `, [username, password]);
    return user;
  } catch (err) {
    throw err;
  }
}
async function getUser({ username, password }) {
  try {
    const { rows: [user] } = await client.query(`
  SELECT id, username
  FROM users
  WHERE username=$1 AND password=$2
  `, [username, password]);
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const { rows: [user] } = await client.query(`
    SELECT id, username
    FROM users
    WHERE id=$1
    `, [userId])
    return user;
  } catch (err) {
    throw err;
  }
}

async function getUserByUsername(userName) {
  try {
    const { rows: [user] } = await client.query(`
  SELECT * FROM users 
  WHERE username=$1
  `, [userName]);
    return user;

  } catch (error) {
    throw error;
  }

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
