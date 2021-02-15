const axios = require('axios');


const destino="https://nowsoft.app/gps";
const desarrollo=destino;


/*
const destino = "http://localhost:3000"
const desarrollo="http://localhost:9000"
*/


export function servidorPost(uri,datos){

    return axios({
        method: 'post',
        headers: {
            'Content-Type':'multipart/form-data'
        },
        url: destino+uri,
        data: datos,
        })

}

    function servidorGet(uri){
        return axios.get(uri).then(resp => {
        return(resp.data);
    });
}

function redireccionar(error){
    if(error.response.status==403){
        window.location.href = destino+'/html/login.html';
    }
}

function servidorDocs(uri, datos) {

    console.log(datos)
    
    return axios({
        method: 'post',
        url: destino+uri,
        data: datos,
        withCredentials: true,
        responseType: 'blob',
        }).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download','reporte.xlsx'); //or any other extension
            document.body.appendChild(link);
            link.click();
    });
}



export const url = destino;