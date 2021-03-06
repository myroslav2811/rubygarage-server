const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { signUp, auth, refreshTokens, getProjects, putProject, deleteProject, getTasks, putTask, deleteTask, changeTaskStatus, updateProject, updateTask, checkToken, logOut, updateTaskPriority } = require('./controllers')
const { checkAuth } = require('./middleware');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/ruby-garage', { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('debug', true);

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path
    .join(__dirname, 'client/build')));



app.post('/signup', signUp);
app.post('/signin', auth);
app.post('/refresh-tokens', refreshTokens);
app.post('/projects', checkAuth, putProject);
app.post('/tasks', checkAuth, putTask);
app.post('/task-status', checkAuth, changeTaskStatus);
app.post('/update-project', checkAuth, updateProject);
app.post('/update-task', checkAuth, updateTask);
app.post('/logout', checkAuth, logOut);
app.post('/update-priority', checkAuth, updateTaskPriority);


app.get('/projects', checkAuth, getProjects);
app.get('/tasks/:id', checkAuth, getTasks);
app.get('/check-token', checkAuth, checkToken);

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.delete('/projects/:id', checkAuth, deleteProject);
app.delete('/task/:projectId/:id', checkAuth, deleteTask);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log("Listening on port 3000"));