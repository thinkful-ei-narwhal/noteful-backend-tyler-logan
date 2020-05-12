module.exports = {
  getAllFolders(db) {
    //get all
    return db('folders').select('*');
  },
  getFolder(db) {
    return db('folders').select('*');
  },
  addFolder(db, newFolder) {
    return db('folders').insert(newFolder).returning('*').then(rows => rows[0]);
  },
  getFolderById(db, id) {
    return db('folders').select('*').where({ id }).first();
  },
  updateFolder(db, id, folderToUpdate) {
    return db('folders').where({ id }).update(folderToUpdate);
  },
  deleteFolder(db, id) {
    return db('folders').where({ id }).delete();
  }
};