var express = require('express');
var app = express();
var bodyParser = require('body-parser');//sirve para que el body de post sea en formato json
const cors = require('cors')
const fileUpload = require('express-fileupload')

var cookieParser = require('cookie-parser')


var expressStaticGzip = require("express-static-gzip");


var uuid = require('uuid');
var path = require('path');
var mime = require('mime');
var moment = require('moment');

const axios = require('axios');

var sess;
//conexión a la base de datos en postgresql




moment.locale('es');


app.use(cors({credentials: true, origin: 'http://localhost:9000'}));

app.use(cookieParser());
app.use(fileUpload())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
  })
)

app.use(bodyParser.json({limit: '50mb'})); 





  app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', "http://localhost:9000");

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


  const fs = require('fs');





//cargue de documentos
app.post('/upload/', (req, res) => {
  
  

    let EDFile = req.files.file

    var archivo = path.join(__dirname, `/repositorio/${EDFile.name}`)
  
    var rename=uuid.v1()+'.'+EDFile.name.split('.').pop()

    var archivo_rename=path.join(__dirname, `/repositorio/${rename}`)
        
    EDFile.mv(archivo,err => {
      
      if (err) return res.status(500).send({ message: err });
      
      fs.rename(archivo, archivo_rename, function (err) {
        
        if (err) return res.status(500).send({ message: err });

        var datos = req.body;
        datos.rinex = 'https://nowsoft.app/gps/rinex/' + rename
        

        var servicio_leo = `http://3.139.107.165:8080/processing?rinex=${datos.rinex}&tipo=${datos.tipo}&correo=${datos.correo}&altura=${datos.altura}&angulo=${datos.angulo}`
        
        console.log(servicio_leo)


        axios.get(servicio_leo).then(resp => {

          return res.status(200).send({datos:resp,servicio:servicio_leo,resultado:"OK"});

        }).catch(function (error) {
          if (Object.keys(error).length==0) {
            return res.status(200).send({servicio:servicio_leo,resultado:"OK"});
          } else {
            return res.status(500).send({error:error,servicio:servicio_leo,resultado:"ERROR"});
            
          }
        });




      });


      

    })


});

app.get('/rinex/:ruta', function(req, res){
  
  var ruta=req.params.ruta;

  var file = path.join(__dirname, `/repositorio/${ruta}`)
  

  
  var filename = path.basename(file);



  var mimetype = mime.lookup(file);

  res.setHeader('Content-disposition', 'inline; filename=' + filename);
  res.setHeader('Content-type', mimetype);

  var filestream = fs.createReadStream(file);
  filestream.pipe(res); 
    

});


//var DIST_DIR = path.join(__dirname, "../dist/");

//app.use("/", expressStaticGzip(DIST_DIR));
var DIST_DIR = path.join(__dirname, "../dist/");

app.use( '/',expressStaticGzip(DIST_DIR));


app.get('/web/*', (req,res) =>{
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});


//backend en el puerto 3000
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});