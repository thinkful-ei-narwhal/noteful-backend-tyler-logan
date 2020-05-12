require('dotenv');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const NotesRouter = require('./NotesRouter');
const FoldersRouter = require('./FoldersRouter');
const { NODE_ENV, API_TOKEN } = require('./config');

const app = express();


const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(cors());
app.use(helmet());
app.use(morgan(morganOption));

// app.use(function requireAuth(req, res, next) {
//   const authValue = req.get('Authorization') || 'my-secret';

//   //verify bearer
//   if (!authValue.toLowerCase().startsWith('bearer')) {
//     return res.status(400).json({ error: 'Missing bearer token' });
//   }

//   const token = authValue;

//   if (token !== API_TOKEN) {
//     return res.status(401).json({ error: 'Invalid token' });
//   }

//   next();
// });
app.use('/api/notes', NotesRouter);
app.use('/api/folders', FoldersRouter);

app.use(function errorMiddleWare(err, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'Server error' } };
  } else {
    console.log(err);
    response = { error: err, message: err.message };
  }
  res.status(500).json({ error: err.message });
  next();
});

module.exports = app;
