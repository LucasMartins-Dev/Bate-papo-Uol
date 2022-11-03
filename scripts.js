let conversas = [];
let conversasant = [];
let usuarios = [];

function carregachat(){

   let promisse = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages')
   promisse.then(conversa_check)
  promisse.catch(errocarregachat)

}
setInterval(carregachat,3000)

function errocarregachat(){
   console.log("Erro para carregar o chat")
}
function conversa_check(resposta){
   console.log("chegou")
   conversas = resposta.data;
   console.log(conversas)
   Chat()
}
let conti;

function Chat(){
   const listaConversas = document.querySelector('.conteudo')
   listaConversas.innerHTML = ''
   for (let i = 0; i<conversas.length;i++){
      
      if(conversas[i].to === 'Todos'||conversas[i].to === nick ||conversas[i].from === nick){
         if( conversas[i].text === "entra na sala..."||conversas[i].text === "sai da sala..."){
            listaConversas.innerHTML += `
            <li class = "status" data-test="message" id ="${i}">
            <h1>(${conversas[i].time})</h1>
            <h2>${conversas[i].from} : </h2>
            <h3> ${conversas[i].text}</h3>
         </li>
         `
         }else if(conversas[i].to === "Todos"){
   
            listaConversas.innerHTML += `
            <li class = "msg" data-test="message" id ="${i}">
               <h1>(${conversas[i].time})</h1>
               <h2>${conversas[i].from} </h2>
               <h3> para </h3>
               <h2>${conversas[i].to} : </h2>
               <h3> ${conversas[i].text}</h3>
            </li>
            `
         }else{
   
         listaConversas.innerHTML += `
         <li class = "msg_private" data-test="message" id ="${i}">
            <h1>(${conversas[i].time})</h1>
            <h2>${conversas[i].from} </h2>
            <h3> para </h3>
            <h2>${conversas[i].to} : </h2>
            <h3> ${conversas[i].text}</h3>
         </li>
         
         `
      }


      }
     
   
   }
   const elementoQueQueroQueApareca = document.getElementById(conversas.length-1);
   if(conversasant !== null){
      if(conversasant !== conversas){
       if(elementoQueQueroQueApareca !== null){
      elementoQueQueroQueApareca.scrollIntoView();
   }  
      }
   }
   
   conversasant = conversas;
}
let nick;
 function entrarnasala(){
   let hidden = document.querySelector('.login')
   hidden.classList.add('hidden')
    nick =  document.getElementById('nickname').value
   let entrarnasala = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants ',{
      name: nick
    })
    pegarusers()
    
 }
 
function erroentrarnasala(){
console.log("Erro ao entrar na sala")
}

 function conectado(){
   let conexao = axios.post('https://mock-api.driven.com.br/api/v6/uol/status',
 {
   name: nick
 }) 
 conexao.catch(erroconectar)

 }
 setInterval(conectado,5000)

 function pegarusers(){
    let conectar = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants ')
   conectar.then(listausuarios)
   let selectpublico = document.querySelector('.publico')
      selectpublico.classList.add('public')
      let selectprivado = document.querySelector('.privado')
      selectprivado.classList.remove('privad')
      tipomensagem = 'Público'
 }
 setInterval(pegarusers,10000)
 function listausuarios(resposta){
   usuarios = resposta.data
   console.log(usuarios)
   const listaUsuarios = document.querySelector('.online')
   listaUsuarios.innerHTML = `
   <div class="usu data-test="all" tela" id = "0" onclick = "selecionar_usuario(this)">
   <img src="imagens/Vector.svg">
   <h3>Todos</h3>
   <ion-icon name="checkbox" class="check "></ion-icon>
   </div>
   `
 for (let i = 0; i<usuarios.length;i++){
   if(usuarios[i].name !== nick){
      listaUsuarios.innerHTML +=`
      <div class = "usu" data-test="participant" id ="${i+1}" onclick = "selecionar_usuario(this)">
      <img src="imagens/usuario.svg">
         <h3>${usuarios[i].name}</h3>
         <ion-icon name="checkbox" class="check "></ion-icon>
      </div>
      `
   }
  
 }

 }


function erroconectar(){
   console.log(" Erro ao se manter conectado")
}

function enviarChat(){
  let txt =  document.getElementById('txt').value
  console.log(txt)
  if(txt !== ''){
   let enviar = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",
   {
      from: nick,
      to: usuarioselecionado,
      text: txt,
      type: "message" 
   })
   enviar.catch(erromsg)

  }
   document.getElementById('txt').value='';
   carregachat()
}
function erromsg(){
   window.location.reload()
}
document.addEventListener("keypress", function(click){
if(click.key === "Enter"){
   enviarChat()
}
})

function acessarmenu(){
 let val = document.querySelector('.menu_lateral')
 val.classList.remove('hidden')
 
}
function sairmenu(){
   let val = document.querySelector('.menu_lateral')
   val.classList.add('hidden')
}
let usuarioselecionado = 'Todos'
let tipomensagem = 'Público'

function selecionar_usuario(botao) {
   usuarioant = document.querySelector(".tela");
 
   
   if (usuarioant !== null) {
     usuarioant.classList.remove("tela");
   }
   botao.classList.toggle("tela");
   console.log(botao.children[1].innerHTML)
   if(botao.children[1].innerHTML=="Todos"){
      let selectpublico = document.querySelector('.publico')
      selectpublico.classList.add('public')
      let selectprivado = document.querySelector('.privado')
      selectprivado.classList.remove('privad')
      tipomensagem = 'Público'
   }else{
      let selectpublico = document.querySelector('.publico')
      selectpublico.classList.remove('public')
      let selectprivado = document.querySelector('.privado')
      selectprivado.classList.add('privad')
      tipomensagem = 'Reservadamente'
   }
  usuarioselecionado = botao.children[1].innerHTML
   console.log(usuarioselecionado)
   const UsuarioSelect = document.querySelector('.destinatario')
   UsuarioSelect.innerHTML = ''
   UsuarioSelect.innerHTML = 
   `
   <input type="text" placeholder="Escreva aqui..." id = "txt"> </input>
   <h3>Enviar para: ${usuarioselecionado} (${tipomensagem})</h3>
   `
 }