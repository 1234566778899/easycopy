const btnPregunta = document.querySelector('#btnPreguntar');
const delay = document.querySelector('.delay');
const btnCancelar = document.querySelector('#btnCancelar');
const btnCancelar_r = document.querySelector('#btnCancelar-r');
const cont1 = document.querySelector('.cont1');
const cont2 = document.querySelector('.cont2');
const nombre = document.querySelector('#nombre');
const btnIngresar = document.querySelector('#btnIngresar');
const conectados = document.querySelector('.conectados');
const btnEnviar = document.querySelector('#btnEnviar');
const btnEnviar_r = document.querySelector('#btnEnviar-r');
const inputPregunta = document.querySelector('#inputPregunta');
const contTotal = document.querySelector('.contTotal');
const delay_r = document.querySelector('.delay-r');
const inputRespuesta = document.querySelector('#inputRespuesta');
const title = document.querySelector('#title');
const inputFind = document.querySelector('#pregunta');
let _id = '';



let socket = io();
let preguntas = [];

btnIngresar.addEventListener('click', () => {
    title.innerHTML = nombre.value;
    btnPregunta.style.display = 'block'
    cont1.style.display = 'none';
    cont2.style.display = 'flex';
    conectados.style.display = 'flex';
    socket.emit('add user', {
        id: socket.id,
        user: nombre.value
    })
})

socket.on('send users', (data) => {
    $('.conectados').html('');
    for (let i = 0; i < data.length; i++) {
        $('.conectados').append(`<div class="item">${data[i].user}</div>`);
    }
})

btnPregunta.addEventListener('click', () => {
    delay.style.display = 'flex';
})

btnCancelar.addEventListener('click', () => {
    delay.style.display = 'none';
})

btnEnviar.addEventListener('click', () => {
    let num = Math.floor(Math.random() * 10000);
    delay.style.display = 'none';
    socket.emit('add pregunta', {
        id: num,
        user: nombre.value,
        pregunta: inputPregunta.value,
        likes: 0,
        comentarios: 0,
        estado: false,
        respuestas: []
    });
    inputPregunta.value = '';
})

function marcar(item) {
    if (item.estado) return 'click';
    return 'otro';
}
function updateDom(data) {
    $('.contTotal').html(``);
    for (let i = 0; i < data.length; i++) {
        let p1 = `<div class="azul2 contPregunta">
        <div class="azul1 contuserpregunta" id="p${data[i].id}">   
            <span class="user userPregunta">${data[i].user}</span> <br/>
            <span class="pregunta">${data[i].pregunta}</span>
        </div>
        <div class="respuesta" id="r${data[i].id}">`;
        let p2 = ''
        for (let j = 0; j < data[i].respuestas.length; j++) {
            p2 += `<div class="azul1 contuserpregunta mt-1">
            <span class="user userRespuesta">${data[i].respuestas[j].user}</span><br>
            <span class="pregunta">${data[i].respuestas[j].contenido}</span>
             </div>`
        }
        let p3 = `</div>
        <div class="d-flex justify-content-between mt-1">
            <div class="like" id="${data[i].id}" onclick="darLike(event)">
            <i class="fa-regular fa-heart ${marcar(data[i])}"></i>
            <span class="ms-2 cantidad">${data[i].likes}</span>
            </div>
            <div class="comentar me-2">
            <i class="fa-solid fa-reply" id="${data[i].id}" onclick="responder(event)"></i>
            <span class="ms-2">${data[i].comentarios}</span>
            </div>
            </div>
            </div>`
        $('.contTotal').append(p1 + p2 + p3);
    }
}
function darLike(e) {
    _id = e.path[1].id;
    let idx = preguntas.findIndex(x => x.id == _id);
    if (!preguntas[idx].estado && idx != -1) {
        preguntas[idx].estado = true;
        updateDom(preguntas);
        socket.emit('enviar-like', {
            id: _id
        })
    }
}
socket.on('recibir-like', (data) => {
    let idx = preguntas.findIndex(x => x.id == data.id);
    preguntas[idx].likes++;
    updateDom(preguntas);
})
socket.on('recibir pregunta', (data) => {
    preguntas.unshift(data);
    updateDom(preguntas);
})
inputFind.addEventListener('input', () => {
    let text = inputFind.value.toUpperCase();
    let aux = preguntas.filter(x => x.pregunta.toUpperCase().includes(text));
    updateDom(aux);
})
btnCancelar_r.addEventListener('click', () => {
    delay_r.style.display = 'none';
})
function responder(e) {
    _id = e.path[0].id;
    delay_r.style.display = 'flex';
}

btnEnviar_r.addEventListener('click', () => {
    delay_r.style.display = 'none';
    socket.emit('responder', {
        id: _id,
        user: nombre.value,
        contenido: inputRespuesta.value
    });
    inputRespuesta.value = '';
})

socket.on('recibir respuesta', (data) => {
    let idx = preguntas.findIndex(x => x.id == data.id);
    preguntas[idx].respuestas.push(data);
    updateDom(preguntas);
})

