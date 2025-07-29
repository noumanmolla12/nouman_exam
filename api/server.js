require('dotenv').config(); 

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const createError = require('http-errors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const dbConfig = require('./db/database');
mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log(' Database connected');
}).catch(err => {
  console.error(' MongoDB connection error:', err);
});

// Routes
app.use('/loginadmin', require('./routes/authadmin.routes'));
app.use('/loginstudent', require('./routes/authstudent.routes'));
app.use('/admin', require('./routes/admin.routes'));
app.use('/student', require('./routes/student.routes'));
app.use('/category', require('./routes/category.routes'));
app.use('/topic', require('./routes/topic.routes'));
app.use('/questions', require('./routes/question.routes'));
app.use('/answers', require('./routes/answer.routes'));
app.use('/exam', require('./routes/exam.routes'));
app.use('/result', require('./routes/result.routes'));

// Root & 404 handler
app.get('/', (req, res) => {
  res.send(' API is running...');
});

app.use((req, res, next) => {
  next(createError(404, 'Not Found'));
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send(err.message);
});

// Start server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(` Server running on port ${port}`);
});
