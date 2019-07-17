const db = require("../data/db-config.js");

module.exports = {
  find,
  findById,
  findUserPosts,
};

function find() {
  return db("users");
}

function findById(id) {
  return db("users")
    .where({ id }) //always returns an array
    .first() //returns the first record
    .then(user => {
      if (user) {
        return user; // if user is found, return user
      } else {
        return null; //if user is not found, return null
      }
    });
}

function findUserPosts(userId) {
  return db("users as u")
    .innerJoin("posts as p", "u.id", "p.user_id")
    .select("p.contents as quote", "u.username as author")
    .where({ user_id: userId });
}

// function insert(user) {
//   return db("users").insert(user);
// }
