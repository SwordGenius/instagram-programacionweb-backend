const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

//conexión con la base de datos
const {connection} = require("../config.db");
const {request, response} = require("express");

const getUsuarios = async (request, response) => {
     connection.query("SELECT * FROM usuarios",
        (error, results) => {
            if(error)
                throw error;
            response.status(200).json(results);
            console.log(response)
        });
};

//ruta
app.route("/usuarios")
    .get(getUsuarios);

const postUsuario = async (request, response) => {
    const {email, password, user} = request.body;
    connection.query("INSERT INTO usuarios( email, password, user) VALUES (?,?,?) ",
        [ email, password, user],
        (error, results) => {
            if(error)
                throw error;
            response.status(201).json({"Item añadido correctamente": results.affectedRows});
        });
};

//ruta
app.route("/usuarios")
    .post(postUsuario);


const delUsuario = async (request, response) => {
    const id = request.params.id;
    connection.query("Delete from usuarios where id_usuarios = ?",
        [id],
        (error, results) => {
            if(error)
                throw error;
            response.status(201).json({"Item eliminado":results.affectedRows});
        });
};

//ruta
app.route("/usuarios/:id")
    .delete(delUsuario);

const patchUsuario = async (request, response) => {
    const id = request.params.id;
    const {campo, valor} = request.body;
    connection.query('UPDATE usuarios SET ?? = ? WHERE id_usuarios = ?',
        [campo, valor, id],
        (error, results) => {
            if(error)
                throw error;
            response.status(201).json({"Item actualizado":results.affectedRows});
        });
}
app.route("/usuarios/:id").patch(patchUsuario);
const getByUsuario = async (request, response) => {
    const id = request.params.id;
    connection.query("SELECT * FROM usuarios WHERE email = ?",
        [id],
        (error, results) => {
            if(error)
                throw error;
            response.status(200).json(results);
        });
}
app.route("/usuarios/:id")
    .get(getByUsuario);


module.exports = app;