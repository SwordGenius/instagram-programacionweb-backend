const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const {serialize} = require("cookie");

const dotenv = require("dotenv");
const {json} = require("express");
dotenv.config();

const loginAuth = async (req, res) => {
    const response = await fetch('http://localhost:3300/usuarios/'+req.body.email)
    if (response.ok){
        const data = await response.json()
        try{
            if (data[0].email === req.body.email && data[0].password === req.body.password){
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    email: data[0].email,
                    password: data[0].password,
                }, process.env.SECRET)
                const serialized = serialize('aToken', token, {
                    httpOnly: true,
                    sameSite: 'none',
                    maxAge: 60 * 60 * 1000,
                    path: '/',
                })
                res.setHeader("Set-Cookie", serialized);
                res.cookie(serialized);
                res.send();
                return 'successfully';
            }
        } catch (e) {
            return res.status(401).json('Task failed');
        }
    }
    return res.status(401).json('Task failed');
}

app.route('/auth').post(loginAuth);

const logoutHandler = async (req, res) => {
    const {aToken} = req.cookies;
    if (!aToken){
        return res.status(401).json({error: 'not auth'})
    }

    try {
        jwt.verify(aToken, process.env.SECRET);
        const serialized = serialize('aToken', null, {
            httpOnly: true,
            sameSite: 'none',
            maxAge: 0,
            path: '/',
        })
        res.setHeader("Set-Cookie", serialized);
        res.cookie(serialized);
        res.send();
        return 'successfully';
    }catch (e) {
        return res.status(401).json({error: 'invalid token'})
    }
}

app.route('/auth').get(logoutHandler);

module.exports = app;