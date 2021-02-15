import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { useForm ,Controller} from 'react-hook-form';

import { servidorPost } from './request'
import { Redirect } from 'react-router'

import NumberFormat from 'react-number-format';
import { RHFInput } from 'react-hook-form-input';

import { render } from 'react-dom'
import { transitions,types, positions, Provider as AlertProvider } from 'react-alert'

import { useAlert } from 'react-alert'
import CheckIcon from '@material-ui/icons/Check';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"


import ProgressBar from "@ramonak/react-progress-bar";


const axios = require('axios');

const AlertTemplate = ({ style, options, message, close }) => (
  <div style={style} className={options.clase}>
    {options.type === 'info' && ''}
    {options.type === 'success' && <CheckIcon/>}
    {options.type === 'error' && <ErrorOutlineIcon/>}
    {message}
    <button onClick={close}>X</button>
  </div>
)

const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE,
  clase:'alert'
}


const App = () => {

  return (
     <AlertProvider template={AlertTemplate} {...options}>
      <Login/>
    </AlertProvider>
    
  )
}

const Load =({show})=> {

  const [visible, setVisible] = React.useState(show);

   return(
    <Loader
       type="Rings"
       color="#6D597A"
       height={100}
       width={455}
       timeout={0} //3 secs
       visible={show}
    />
   );

}


const Login = () => {
  const { register, handleSubmit, errors,control,setValue,reset } = useForm({criteriaMode: 'all'});


  const [altura, setAltura] = React.useState(0);
  const [angulo, setAngulo] = React.useState(0);
  const [visible, setVisible] = React.useState(false);
  const [progreso, setProgreso] = React.useState(0);

  var fileInput = React.createRef();

  const alert = useAlert()

  const onSubmit = data => {
    console.log(data)
    
    setVisible(true)
    const formData = new FormData()

    const file = data.rinex[0];


    formData.append("file", file)
    formData.append("tipo", data.tipo)
    formData.append("altura", data.altura)
    formData.append("angulo", data.angulo)
    formData.append("correo", data.correo)

      axios({
        method: 'post',
        headers: {
            'Content-Type':'multipart/form-data'
        },
        url: 'https://nowsoft.app/gps/upload',/*'http://localhost:3000/upload',*/
        data: formData,
        onUploadProgress: (ev) => {
          const progress = ev.loaded / ev.total * 100;
          setProgreso(Math.round(progress))
      },
      }).then((result) => {
        
        reset()
        alert.success('Se enviará en breve los resultados a su correo.',{ clase:'alert'})
        setVisible(false)

      }).catch(function (error) {

        alert.error('Error', { clase:'wrong'})
          setVisible(false)

      });



    /*

    const post = async () => {


      const formData = new FormData()

      const file = data.rinex[0];
      console.log(file)

      formData.append("file", file)
      formData.append("tipo", data.tipo)
      formData.append("altura", data.altura)
      formData.append("angulo", data.angulo)
      formData.append("correo", data.correo)

      setVisible(true)

      const result = await servidorPost('/upload', formData)

      console.log(result.status)

      if (result.status==200) {
        reset()
        alert.show('Se enviará en breve los resultados a su correo.')
        setVisible(false)
      } else { 
        
      }

    }
    post();
    */

  };


  return (
    <div id="login">

      <div id="contenido">
        <div className="crop">
          <img src="https://nowsoft.app/gps/img/header1.png" alt="" />

        </div>
        
        <h2>Procesamiento RINEX</h2>
        <p className="descripcion">Bienvenido al aplicativo para el procesamiento del archivo RINEX</p>

        
    {!visible?
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grupo">

            <p>Tipo de procesamiento:</p>

            <select name="tipo" ref={register({ required: true })}>
            <option value="AUTO">Determinar de forma atomática</option>
              <option value="PPP">PPP (Posicionamiento de punto preciso)</option>
              <option value="DGPS">DGPS (Posicionamiento GPS diferencial)</option>
            </select>
                      

            <p>Altura (m):</p>

            
            <Controller
                  name='altura' 
                  control={control}
                  as={<NumberFormat
                    thousandSeparator={true} allowNegative={false}
                    value={altura}
                  />}
                //rules={{required:true}}
                  defaultValue={altura} 
              

                  rules={{ required: true,max:5 }}
                    />
           {errors.altura?.type === "required" && "Campo obligatorio!"}
           {errors.altura?.type === "max" && "Ingrese un valor entre 0 y 5 metros"}

            <p>Angulo de elevación</p>
            
            <Controller
                  name='angulo' 
                  control={control}
                  as={<NumberFormat
                    thousandSeparator={true} allowNegative={false}
                    value={angulo}
                  />}
                //rules={{required:true}}
              defaultValue={angulo} 
              rules={{ required: true ,max:30}}
                />
             {errors.angulo?.type === "required" && "Campo obligatorio!"}
            {errors.angulo?.type === "max" && "Ingrese un valor entre 0 y 30 grados"}
            
            <p>Correo electrónico</p>
            <input type="email" placeholder="correo" name="correo" ref={register({ required: true })} />
            {errors.correo?.type === "required" && "Campo obligatorio!"}

            <p>Archivo RINEX</p>
            <input ref={register} type="file" name="rinex" ref={register({ required: true })} accept="text/plain" />
            {errors.rinex?.type === "required" && "Seleccione un archivo!"}

            <button type="submit" className="primmary">Enviar para procesamiento</button>


          </div>

          

          </form>
          :
          <>
          <Load show={visible} />
            <ProgressBar
              completed={progreso}
              height="10px"
              bgcolor="#6D597A"
              labelSize="12px"
              width="90%"
              margin="5px 5%"
              padding="1px"
              />
          <p className="wait">Subiendo los datos para el procesamiento ...</p>
          </>
          }
       

        <p className="contacto">Contacto: leo.cardona.p@gmail.com </p>

      </div>
    </div>
  );
}



export default App;