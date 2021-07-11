const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 9195;
const accountRoutes = require('./routes/account');
const roleRoutes = require('./routes/role');
const accountStatusRoutes = require('./routes/accountStatus');
//header
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//     );
//     if (req.method === 'OPTIONS') {
//         res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
//         return res.status(200).json({});
//     }
//     next();
// });

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header("Access-Control-Allow-Credentials", true);
    next();
});


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

///
app.get('/', (req, res) => {
    res.json({ 'message': 'ok' });
})

app.use('/account', accountRoutes);
app.use('/role', roleRoutes)
app.use('/account-status', accountStatusRoutes)
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