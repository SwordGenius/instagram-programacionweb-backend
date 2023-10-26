const express = require("express");
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
app.use(cors(
    {
        origin: true,
        credentials: true,
    }
));
app.use(express.static(
    path.join(__dirname, '/dbimages')
))
app.use(express.static(
    path.join(__dirname, '/dbtext')
))
app.use(cookieParser());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header("Access-Control-Allow-Credentials", "true")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use(require('./routes/usuario'));
app.use(require('./routes/auth'));
app.use(require('./routes/publicaciones'));

app.listen(process.env.PORT||3300,() => {
    console.log("Servidor corriendo en el puerto 3300");
});

module.exports = app;