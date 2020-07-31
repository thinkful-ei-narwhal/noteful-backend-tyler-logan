const knex = require("knex");
const app = require("../src/app");
const notefulFixture = require("./notefulfixture");

describe("Note Endpoints", function () {
  let db;
  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });
  before(() => db.raw("TRUNCATE folders, notes RESTART IDENTITY CASCADE"));
  before(() => db.raw("TRUNCATE notes, notes RESTART IDENTITY CASCADE"));
  after(() => db.destroy());

  context("Given there are notes and folders in the database", () => {
    beforeEach("insert folders", () => {
      return db.into("folders").insert(notefulFixture.folders);
    });
    beforeEach("insert notes", () => {
      return db.into("notes").insert(notefulFixture.notes);
    });

    it("should return the notes table", () => {
      supertest(app).get("/notes").expect(200, notefulFixture.notes);
    });
  });
});
