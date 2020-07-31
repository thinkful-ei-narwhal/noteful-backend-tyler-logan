const NotesService = require("./NotesService");
const express = require("express");
const xss = require("xss");
const notesRouter = express.Router();
const jsonParser = express.json();

const serialize = (note) => ({
  id: note.id,
  name: xss(note.name),
  modified: note.modified,
  folder_id: note.folder_id,
  content: xss(note.content),
});
notesRouter
  .route("/")
  .get((req, res, next) => {
    const db = req.app.get("db");
    NotesService.getAllNotes(db)
      .then((notes) => {
        return res.json(notes.map((note) => serialize(note)));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { name, folder_id, content } = req.body;
    const newNote = { name, folder_id, content };
    for (const [key, value] of Object.entries(newNote)) {
      if (value == null) {
        return res
          .status(400)
          .json({ error: { message: `Missing ${key} in request` } });
      }
    }

    NotesService.addNote(req.app.get("db"), newNote)
      .then((note) => {
        res.status(201).json(serialize(note));
      })
      .catch((err) => next(err));
  });

notesRouter
  .route("/:id")
  .get((req, res, next) => {
    const { id } = req.params;
    const db = req.app.get("db");

    NotesService.getNoteById(db, id)
      .then((note) => {
        return res.json(serialize(note));
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const { id } = req.params;
    NotesService.deleteNote(req.app.get("db"), id)
      .then(() => {
        return res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { name, folder_id, content } = req.body;
    const modified = new Date();
    const noteToUpdate = { name, modified, folder_id, content };
    for (const [key, value] of Object.entries(noteToUpdate)) {
      if (value == null) {
        return res
          .status(400)
          .json({ error: { message: `Missing ${key} in request` } });
      }
    }

    NotesService.updateNote(req.app.get("db"), req.params.id, noteToUpdate)
      .then((note) => {
        res.status(204).json(serialize(note)).end();
      })
      .catch((err) => next(err));
  });
module.exports = notesRouter;
