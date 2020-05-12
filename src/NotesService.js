
module.exports = {
  getAllNotes(db) {
    //get all
    return db('notes').select('*');
  },
  getNote(db) {
    return db('notes').select('*');
  },
  addNote(db, newNote) {
    return db('notes').insert(newNote).returning('*').then(rows => rows[0]);
  },
  getNoteById(db, id) {
    return db('notes').select('*').where({ id }).first();
  },
  updateNote(db, id, noteToUpdate) {
    return db('notes').where({ id }).update(noteToUpdate);
  },
  deleteNote(db, id) {
    return db('notes').where({ id }).delete();
  }
};
