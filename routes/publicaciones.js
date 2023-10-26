const express = require("express");
const app = express();
const multer = require('multer');
const path = require('path')
const fs = require('fs');

const dotenv = require("dotenv");
dotenv.config();

const {connection} = require("../config.db");
const {request, response} = require("express");

const diskStorage = multer.diskStorage({
    destination: path.join(__dirname, '../images'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const fileUpload = multer({
    storage: diskStorage,
}).single('image');
const getPub = async (request, response) => {
    connection.query("SELECT * FROM publicaciones",
        (error, results) => {
            if(error)
                throw error;
            results.map(img => {
                fs.writeFileSync(path.join(__dirname, '../dbimages/' + img.id_publicaciones + '.png'), img.publicacion)
            })
            results.map(text => {
                fs.writeFileSync(path.join(__dirname, '../dbtext/' + text.text_pub), text.text_pub)
            })
            const imagedir = fs.readdirSync(path.join(__dirname, '../dbimages/'));
            const textdir = fs.readdirSync(path.join(__dirname, '../dbtext'));

            response.json({imagedir, textdir});

            console.log(results);
        });
};

//ruta
app.route("/pub")
    .get(getPub);

const postPub = async (request, response) => {
    console.log("xd")
    const texto = request.body.text;
    console.log("xd")
    const data = fs.readFileSync(path.join(__dirname, '../images/' + request.file.filename))
    connection.query("INSERT INTO publicaciones(publicacion, text_pub) VALUES (?,?) ",
        [ data, texto],
        (error, results) => {
            if(error)
                throw error;
            response.status(201).json({"Item añadido correctamente": results.affectedRows});
        });
};

app.route("/pub")
    .post(fileUpload, postPub);


const delPub = async (request, response) => {
    const id = request.params.id;
    connection.query("Delete from publicaciones where id_publicaciones = ?",
        [id],
        (error, results) => {
            if(error)
                throw error;
            response.status(201).json({"Item eliminado":results.affectedRows});
        });
};

//ruta
app.route("/pubs/:id")
    .delete(delPub);

const patchPub = async (request, response) => {
    const id = request.params.id;
    const {campo, valor} = request.body;
    connection.query('UPDATE publicaciones SET ?? = ? WHERE id_publicaciones = ?',
        [campo, valor, id],
        (error, results) => {
            if(error)
                throw error;
            response.status(201).json({"Item actualizado":results.affectedRows});
        });
}
app.route("/pubs/:id").patch(patchPub);
const getByPub = async (request, response) => {
    const id = request.params.id;
    connection.query("SELECT email, password FROM publicaciones WHERE id_publicaciones = ?",
        [id],
        (error, results) => {
            if(error)
                throw error;
            response.status(200).json(results);
        });
}
app.route("/pubs/:id")
    .get(getByPub);


module.exports = app;