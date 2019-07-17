const express = require("express");

const db = require("../data/db-config.js");
const Users = require("./user-model.js");

const router = express.Router();

router.get("/", (req, res) => {
  Users.find()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to get users" });
    });
});

// router.get("/", async (req, res) => {
//   try {
//     const users = await db("users");
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to get users" });
//   }
// });

router.get("/:id", (req, res) => {
  const { id } = req.params;

  Users.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "Could not find user with given id." });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to get user" });
    });
});

// router.get("/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const [user] = await db("users").where({ id });

//     if (user) {
//       res.json(user);
//     } else {
//       res.status(404).json({ message: "Could not find user with given id." });
//     }
//   } catch (err) {
//     res.status(500).json({ message: "Failed to get user" });
//   }
// });

router.get("/:id/posts", (req, res) => {
  Users.findUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/", async (req, res) => {
  const userData = req.body;

  try {
    const [id] = await db("users").insert(userData);
    res.status(201).json({ created: id });
  } catch (err) {
    res.status(500).json({ message: "Failed to create new user" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  try {
    const count = await db("users")
      .where({ id })
      .update(changes);

    if (count) {
      res.json({ update: count });
    } else {
      res.status(404).json({ message: "Could not find user with given id" });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const count = await db("users")
      .where({ id })
      .del();

    if (count) {
      res.json({ removed: count });
    } else {
      res.status(404).json({ message: "Could not find user with given id" });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

module.exports = router;
