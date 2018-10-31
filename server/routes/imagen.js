const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificarToken, checkRoleAdmin, verificarTokenUrl } = require('../middlewares/authentication');
const app = express();

app.get('/imagen/:tipo/:img', verificarTokenUrl, (req, res) => {
    const { tipo, img } = req.params;
    const pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if(fs.existsSync(pathImagen)){
        res.sendFile(pathImagen);
    }
    else{
        const noImgPath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImgPath);
    }
})

module.exports = app;