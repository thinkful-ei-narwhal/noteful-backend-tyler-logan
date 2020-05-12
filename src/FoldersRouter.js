const express = require('express');
const { v4: uuid } = require('uuid');
const logger = require('./logger');
const xss = require('xss');
const FoldersRouter = express.Router();
const dataParser = express.json();
const FoldersService = require('./FoldersService');

const sanitize = folders => ({
  id: folders.id,
  title: xss(folders.title)
});

FoldersRouter
  .route('/')
  .get((req, res, next) => {
    FoldersService.getAllFolders(req.app.get('db'))
      .then(folders => res.json(folders.map(folder => sanitize(folder))));
  })
  .post(dataParser, (req, res, next) => {
    // console.log('post route is here');
    const { title } = req.body;
    // const id = uuid();
    const newFolder = {
      title
    };

    if (!title) {
      logger.error('Failed post : User did not supply folder title');
      return res.status(400).json({ error: 'Folder Title is required' });
    }
    FoldersService.addFolder(req.app.get('db'), newFolder)
      .then(folder => res.status(201).json(sanitize(folder)))
      .catch(error => next(error));
  });

// logger.info(`Successful post : Folder ${title} was added with id: ${id}`);

//get by ID
FoldersRouter
  .route('/:id')
  .all((req, res, next) => {
    const { id } = req.params;
    FoldersService.getFolderById(req.app.get('db'), id)
      .then(folder => {
        if (!folder) {
          logger.error(`Failed get folder with id: ${id}`);
          return res.status(404).json({
            error: { message: 'Folder doesn\'t exist' }
          });
        }
        logger.info(
          `Successful get : folder ${folder.title} was retrieved with id: ${folder.id}`
        );
        res.folder = folder;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(sanitize(res.folder));
  })
  .delete((req, res, next) => {
    const { id } = req.params;

    if (!id) {
      logger.error(`Failed to delete folder with id: ${id}`);
      return res.status(404).json({ error: { message: 'Folder does not exist' } });
    }
    FoldersService.deleteFolder(req.app.get('db'), id)
      .then(folder => res.status(204).json(sanitize(folder)).end())
      .catch(error => next(error));
  })

  .patch(dataParser, (req, res, next) => {
    const { title } = req.body;
    const { id } = req.params;
    const folderToUpdate = { title };

    // console.log('PATCH TITLE:', title);


    if (!title) {
      return res.status(400).json({
        error: { message: 'Request body must contain \'title\'' }
      });
    }
    if (!id) {
      return res.status(400).json({
        error: { message: 'Request body must contain \'id\'' }
      });
    }

    FoldersService.updateFolder(req.app.get('db'), id, folderToUpdate)
      .then(folderToUpdate => res.status(204).json(sanitize(folderToUpdate)).end())
      // .then(console.log('FOLDER TO UPDATE:', folderToUpdate))
      .catch(error => next(error));
  });

module.exports = FoldersRouter;