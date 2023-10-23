const express = require("express");
const cors = require('cors');
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use(require('./routes/usuario'));

app.listen(process.env.PORT||3300,() => {
    console.log("Servidor corriendo en el puerto 3300");
});

module.exports = app;