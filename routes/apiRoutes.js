// Req mods/create instance of express app
const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// GET /api/notes reads the db.json file and returns all saved notes as JSON
router.get("/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Unable to read notes." });
    } else {
      const notes = JSON.parse(data);
      res.json(notes);
    }
  });
});

// POST /api/notes receives a new note, adds it to the db.json file, then returns the new note
router.post("/notes", (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Unable to read notes." });
    } else {
      const notes = JSON.parse(data);
      notes.push(newNote);
      fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Unable to save note." });
        } else {
          res.status(201).json(newNote);
        }
      });
    }
  });
});

// DELETE /api/notes/:id receives a query parameter containing the id of a note to delete
router.delete("/notes/:id", (req, res) => {
  const noteId = req.params.id;
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Unable to read notes." });
    } else {
      let notes = JSON.parse(data);
      const index = notes.findIndex((note) => note.id === noteId);
      if (index !== -1) {
        notes.splice(index, 1);
        fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: "Unable to delete note." });
          } else {
            res.status(200).json({ message: "Note successfully deleted." });
          }
        });
      } else {
        res.status(404).json({ error: "Note not found." });
      }
    }
  });
});

module.exports = router;
