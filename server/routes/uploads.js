const express = require('express');
const fs = require('fs');
const path = require('path');
const usuarioModel = require('../models/usuario');
const productoModel = require('../models/producto');
const fileUpload = require('express-fileupload');
const {verificarToken, checkRoleAdmin} = require('../middlewares/authentication');

const app = express();

app.use(fileUpload());

app.put('/upload/:tipo/:id', [verificarToken, checkRoleAdmin], (req, res) => {
    const {tipo,id} = req.params;
    const tiposValidos = ['producto', 'usuario'];
    if(tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Tipo inválido',
                tipoUsuario: tipo,
                tiposValidos: tiposValidos.join(', ')
            }
        })
    }
    if(!req.files){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'No se ha seleccionado ningún cuerpo'
            }
        })
    }

    const {archivo} = req.files;
    const archivoSplit = archivo.name.split('.');
    const extension = archivoSplit[archivoSplit.length - 1];
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if(extensionesValidas.indexOf(extension) < 0){
        return res.status(400).json({
            ok: true,
            err:{
                message: 'Extension no válido',
                extensionesValidas: extensionesValidas.join(', '),
                extensionUsuario: extension
            }
        })
    }
    const nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    if(tipo === 'usuario'){
        usuarioModel.findOneAndUpdate({_id: id}, {img: nombreArchivo},(err, usuarioDB) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if(!usuarioDB){
                return res.status(400).json({
                    ok: false,
                    err:{
                        message: 'Usuario no encontrado'
                    }
                })
            }
            const pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`);
            if(fs.existsSync(pathImagen)){
                fs.unlinkSync(pathImagen);
            }
        })
        
    }
    else{
        productoModel.findOneAndUpdate({_id: id}, {img: nombreArchivo}, (err, producoDB) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if(!producoDB){
                return res.status(400).json({
                    ok: false,
                    err:{
                        message: 'Producto no encontrado'
                    }
                })
            }
        })
    }  
    archivo.mv(`uploads/${tipo}s/${nombreArchivo}`, (err, succes) => {
        if(err){
            return res.status(500).json(err)
        }
    
        res.json({
            ok: true,
            img: `${nombreArchivo}`,
            message: 'Archivo subida correctamente'
        })
    })      
})

module.exports = app;
