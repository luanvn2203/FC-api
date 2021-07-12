require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 9191;
const topicRoutes = require('./routes/topic');
const subjectRouter = require('./routes/subject');
const lessionRouter = require('./routes/lession');
const flashcardRouter = require('./routes/flashcard');
const questionRouter = require('./routes/question');
const quizTestRoutes = require('./routes/quizTest')
const quizHistory = require('./routes/quizHistory')
// const accountRoutes = require('./routes/account');


//header
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());



///
app.get('/', (req, res) => {
    res.json({ 'message': 'default' });
})

// app.use('/account', accountRoutes);



app.use('/topic', topicRoutes);
app.use('/subject', subjectRouter);
app.use('/lession', lessionRouter);
app.use('/flashcard', flashcardRouter);
app.use('/question', questionRouter);
app.use('/quiz-test', quizTestRoutes)
app.use('/test', quizHistory)
/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ 'message': err.message });
    return;
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
