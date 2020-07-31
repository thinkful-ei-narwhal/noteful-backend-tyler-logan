const FoldersService = require("./FoldersService");
const express = require("express");
const xss = require("xss");
const foldersRouter = express.Router();
const jsonParser = express.json();

const serialize = (folder) => ({
  id: folder.id,
  folder_name: xss(folder.folder_name),
});
foldersRouter
  .route("/")
  .get((req, res, next) => {
    const db = req.app.get("db");
    FoldersService.getAllFolders(db)
      .then((folders) => {
        return res.json(folders.map((folder) => serialize(folder)));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { folder_name } = req.body;
    const newFolder = { folder_name };

    if (!folder_name) {
      return res
        .status(400)
        .json({ error: { message: "Missing Folder name" } });
    }

    FoldersService.addFolder(req.app.get("db"), newFolder)
      .then((folder) => {
        res.status(201).json(serialize(folder));
      })
      .catch((err) => next(err));
  });

foldersRouter
  .route("/:id")
  .get((req, res, next) => {
    const { id } = req.params;
    const db = req.app.get("db");

    FoldersService.getFolderById(db, id)
      .then((folder) => {
        return res.json(serialize(folder));
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    FoldersService.deleteFolder(req.app.get("db"), req.params.id)
      .then((rowsAffected) => {
        return res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { folder_name } = req.body;
    const folderToUpdate = { folder_name };
    for (const [key, value] of Object.entries(folderToUpdate)) {
      if (value == null) {
        return res
          .status(400)
          .json({ error: { message: `Missing ${key} in request` } });
      }
    }

    FoldersService.updateNote(req.app.get("db"), req.params.id, folderToUpdate)
      .then((folder) => {
        res.status(204).json(serialize(folder)).end();
      })
      .catch((err) => next(err));
  });
module.exports = foldersRouter;
