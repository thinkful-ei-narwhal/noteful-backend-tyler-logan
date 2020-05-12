const express = require('express');
// const { v4: uuid } = require('uuid');
const logger = require('./logger');
const xss = require('xss');
const NotesRouter = express.Router();
const dataParser = express.json();
const NotesService = require('./NotesService');

const sanitize = notes => ({
  id: notes.id,
  name: xss(notes.name),
  description: xss(notes.description),
  modified: xss(notes.modified),
  folder_id: xss(notes.folder_id)
});

NotesRouter
  .route('/')
  .get((req, res, next) => {
    NotesService.getAllNotes(req.app.get('db'))
      .then(notes => res.json(notes.map(note => sanitize(note))));
  })
  .post(dataParser, (req, res, next) => {
    // console.log('post route is here');

    const { name } = req.body;
    const { description } = req.body;
    const { modified } = req.body;
    // console.log(modified);
    const { folder_id } = req.body;

    const newNote = {
      name,
      description,
      modified,
      folder_id,
    };

    if (!name) {
      logger.error('Failed post : User did not supply note name');
      return res.status(400).json({ error: 'note name is required' });
    }
    NotesService.addNote(req.app.get('db'), newNote)
      .then(note => res.status(201).json(sanitize(note)))
      .catch(error => next(error));
  });

//get by ID
NotesRouter
  .route('/:id')
  .all((req, res, next) => {
    const { id } = req.params;
    NotesService.getNoteById(req.app.get('db'), id)
      .then(note => {
        if (!note) {
          logger.error(`Failed get note with id: ${id}`);
          return res.status(404).json({
            error: { message: 'note doesn\'t exist' }
          });
        }
        logger.info(
          `Successful get : note ${note.title} was retrieved with id: ${note.id}`
        );
        res.note = note;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(sanitize(res.note));
  })
  .delete((req, res, next) => {
    const { id } = req.params;

    if (!id) {
      logger.error(`Failed to delete note with id: ${id}`);
      return res.status(404).json({ error: { message: 'note does not exist' } });
    }
    NotesService.deleteNote(req.app.get('db'), id)
      .then(note => res.status(204).json(sanitize(note)).end())
      .catch(error => next(error));
  })

  .patch(dataParser, (req, res, next) => {
    const { name } = req.body;
    const { id } = req.params;
    const { description } = req.body;
    const modified = new Date();
    // console.log(modified);
    const { folder_id } = req.body;
    const noteToUpdate = {
      name,
      description,
      modified,
      folder_id,
    };

    if (!name) {
      return res.status(400).json({
        error: { message: 'Request body must contain \'title\'' }
      });
    }
    if (!id) {
      return res.status(400).json({
        error: { message: 'Request body must contain \'id\'' }
      });
    }
    if (!description) {
      return res.status(400).json({
        error: { message: 'Request body must contain \'description\'' }
      });
    }
    if (!folder_id) {
      return res.status(400).json({
        error: { message: 'Request body must contain \'folder_id\'' }
      });
    }

    NotesService.updateNote(req.app.get('db'), id, noteToUpdate)
      .then(noteToUpdate => res.status(204).json(sanitize(noteToUpdate)).end())
      // .then(console.log('FOLDER TO UPDATE:', noteToUpdate))
      .catch(error => next(error));
  });

module.exports = NotesRouter;