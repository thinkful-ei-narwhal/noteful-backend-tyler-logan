
module.exports = {
  getAllNotes(db) {
    //get all
    return db('notes').select('*');
  },
  getNote(knex) {
    return knex('notes').select('*');
  },
  addNote(knex, newNote) {
    return knex('notes').insert(newNote).returning('*').then(rows => rows[0]);
  },
  getNoteById(knex, id) {
    return knex('notes').select('*').where({ id }).first();
  },
  updateNote(knex, id, noteToUpdate) {
    return knex('notes').where({ id }).update(noteToUpdate);
  },
  deleteNote(knex, id) {
    return knex('notes').where({ id }).delete();
  }
};
