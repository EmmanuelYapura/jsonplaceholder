let url = 'https://jsonplaceholder.typicode.com/' // Esto se puede declarar como una constante
let $btnUsuarios = document.querySelector('#carga-usuarios');
let controlador = true; //Que significa esto?

async function cargaUsuarios(){
    const response = await fetch(`${url}users`)
    const users = await response.json();

    return users;
}

async function tomaPosteos(id){
    let response = await fetch(`${url}posts/${id}/comments`)
    let posteos = await response.json();

    return posteos
}

$btnUsuarios.addEventListener('click', async () => { //Supustamente esto lo vas a modificar asi que lo espero bb
    let users = [];
    let fotos = [];
    let botones = document.querySelectorAll('.oculto');
    let $btnAvanzar = document.querySelector('#btn-avanzar');
    let $btnRetroceder = document.querySelector('#btn-retroceder');
    let $btnPosteos = document.querySelector('#btn-posteos');

    let cont = 0;
    mostrarBotones(botones);
    ocultarBotones($btnUsuarios)
    try{
        users = await cargaUsuarios();
        fotos = await cargaImagenes();
    }catch(e){
        console.log(e);
    }

    cargaPerfil(users,cont,fotos);
    
    $btnAvanzar.addEventListener('click', () => {
        cont = controlaId(cont,1);
        cargaPerfil(users,cont,fotos)
        eliminarPosteos();
        controlador = true;
    })

    $btnRetroceder.addEventListener('click',() =>{
        cont = controlaId(cont,-1);
        cargaPerfil(users,cont,fotos)
        eliminarPosteos();
        controlador = true;
    })

    $btnPosteos.addEventListener('click', async () => {
        let posteos = [];
        
        try{
            posteos = await tomaPosteos(users[cont].id)
        }catch(e){
            console.log(e);
        }

        subirPosteos(posteos,controlador)
        controlador = booleano(controlador);
    })
})

function booleano(bool){ //wtf para que?
    return !bool
}

function cargaPerfil(usuarios,id,fotos){
    let $nombre = document.querySelector('#nombre-usuario');
    let imagenFondo = document.querySelector('#foto');

    $nombre.innerHTML = usuarios[id].name
    imagenFondo.style.backgroundImage = `url(${fotos[id].url})`

}

function controlaId(cont,num){ //Muy enredada esta logica, que se supone que debe controlar?
    if(num === 1){
        cont < 9 ? cont++ : cont = 0
    }else{
        cont > 0 ? cont-- : cont = 9
    }
    return cont
} 

async function cargaImagenes(){

    const response = await fetch(`${url}albums/2/photos`)
    const imagenes = await response.json();

    let arrayImagenes = [];
    arrayImagenes = imagenes.filter(elem => elem.id <= 60)

    return arrayImagenes
} 

function mostrarBotones(elementos){
    elementos.forEach(elemento => {
        elemento.className = "";
    });
}

function ocultarBotones(btn){
    btn.className = "oculto";
}

function eliminarPosteos(){
    const $li = document.querySelectorAll('#lista li');
    $li.forEach(elem => elem.remove())
}

function subirPosteos(arrayPosts,check){ //Esta funcion hace mas de una tarea, unicamente deberia subir los posteos
    //Que es check? Check de que?
    if(check){
        //Aca tambien llevar a otra funcion
        let $ul = document.querySelector('#lista');
        let $fragment = document.createDocumentFragment();
        
        //Desde aca
        arrayPosts.forEach( (li) => {
            const $li = document.createElement('li')
            $li.innerHTML = `<h6>${li.name}</h6><p>${li.body}</p>`
            $fragment.appendChild($li)
        })//Hasta aca lo llevaria a otra funcion
    
        $ul.appendChild($fragment); //Esta la funcion que se encargar de subir todos los posteos?
    } 
    if (!check){ //Revisar lo que son las clausulas de guardas, cambie el else por un if. https://codely.tv/blog/screencasts/clausulas-guarda-refactoring/
        eliminarPosteos();
        console.log('Ya hay posteos!');
    }
}
