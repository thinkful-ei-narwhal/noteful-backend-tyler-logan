
const express = require('express');
const { v4: uuid } = require('uuid');
const logger = require('./logger');
const xss = require('xss');
const NotesRouter = express.Router();
const dataParser = express.json();
const NotesService = require('./NotesService');

// const serialize = notes => ({
//   id: notes.id,
//   name: notes.name,
//   description: xss(notes.description),
//   modified: xss(notes.modified)
// })



NotesRouter
  .route('/')
  .get((req, res, next) => {
    NotesService.getAllNotes(req.app.get('db'))
      .then(notes => res.json(notes.map(note => ({ ...note, name: xss(note.name), description: xss(note.description), modified: xss(note.modified) }))))
  })
  .post(dataParser, (req, res) => {
    const { name, description, modified } = req.body;
    const id = uuid();

    if (!name || !description) {
      logger.error('Failed post : User did not supply name or description');
      res.status(400).json({ error: 'name and description are required' });
    }

    const newNote = {
      id,
      name,
      description,
      modified,
    };

    NotesService.addNote(req.app.get('db'), newNote);
    logger.info(`Successful post : Note ${title} was added with id: ${id}`);
    res.status(201).json({
      ...newNote,
      name: xss(newNote.name),
      description: xss(newNote.description),
      modified: (newNote.modified)
    });
  });
module.exports = NotesRouter;

// notesRouter
//   .route('/')
//   .get((req, res, next) => {
//     NotesService
//       .getNote(req.app.get('db')).then(notes => res.json(notes)).catch(next);
//   })
//   .post((req, res, next) => {
//     const { note_name, folder_id, content } = req.body;
//     const newNote = { note_name, folder_id, content };

//     for (const [key, value] of Object.entries(newNote)) {
//       if (value == null {
//         return res.status(400).json({
//           error: {
//             `Missing '${key}' in request body`
//         }
//         });
//       }
//     }
// NotesService
//   .addNote(
//     req.app.get('db'),
//     newNote
//   )
//   .then(note => {
//     res.status(201)
//       .json(serializeNote(note)))
//   .catch(next);
//     });
//   },
