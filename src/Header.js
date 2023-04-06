import {useEffect, useState} from 'react';
//import logo from './logoInstagram.png';
//! O auth serve para autenticar do contas criadas no firebase.
import firebase from 'firebase';
import {auth, storage, db} from './Firebase.js';



//< Cabeçario do site.
export default function Header(props){
//? Estado da barrinha de progresso.
  const [progress, setProgress] = useState(0);

//? É atualizado com um arquivo é escolhido em tempo real.
  const[file,setFile] = useState(null);
  
//>  Funbção para criar conta
  function criarConta(e){
//+ Evita que um formulário seja enviado ou uma âncora (link) seja 
//+ seguida ao clicar no mesmo.    

    e.preventDefault();
    let email = document.getElementById('email-cadastro').value;
    let username = document.getElementById('username-cadastro').value;
    let senha = document.getElementById('senha-cadastro').value;

    const checkPasswordStrength = (senha) => {
      // Expressão regular para verificar a força da senha
      const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
      /* 
        ^:  início da string
    <  (?=.*\d): a senha deve conter pelo menos um dígito.
    <  (?=.*[a-z]): a senha deve conter pelo menos uma letra minúscula.
    <  (?=.*[A-Z]): a senha deve conter pelo menos uma letra maiúscula.
    <  (?=.*[a-zA-Z]): a senha deve conter pelo menos uma letra.
    <  {8,}: a senha deve ter pelo menos 8 caracteres de comprimento.
        $: fim da string

    ! Caso queira colocar duas letras minuscula:
    ?  (?=.*[a-z].*[a-z] exige que haja pelo menos duas letras minúsculas na senha) 
      */

    
      return regex.test(senha);
    }

    if (!checkPasswordStrength(senha)) {
      alert('A sua senha é fraca, precisa conter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula e um número.');
      return;
    }
//-               Criar conta firebase.
    auth.createUserWithEmailAndPassword(email,senha)
    .then((authUser)=>{
//+   Será adcionado o nome de usuário ao objeto do usuário no firebase.

      authUser.user.updateProfile({
        displayName:username
      })
      alert('Conta criada com sucesso!');
      let modal = document.querySelector('.modalCriarConta');
      modal.style.display = "none";
    }).catch((error) =>{
      alert(error.message);
    });    
  }

  //>  Funbção para logar na conta criada.
  function logar(e){
    e.preventDefault();
    let email = document.getElementById('email-login').value;
    let senha = document.getElementById('senha-login').value;
    auth.signInWithEmailAndPassword(email,senha)
    .then((auth)=>{
      props.setUser(auth.user.displayName);
      alert("Logado com sucesso");
      window.location.href="/";
    }).catch((err)=>{
      alert(err.message);
    })
    
  }

  function deslogar(e){
    e.preventDefault();
    auth.signOut().then(function(val){
      props.setUser(null);
      window.location.href="/";
    })
  }


  //>  Função abriar a div para criar conta
  function abrirModalCriarConta(e){
    e.preventDefault();
    let modal = document.querySelector('.modalCriarConta');
    modal.style.display = "block";
  }
  
  //>  Função fechar a div de criar conta
  function fecharModalCriar(){
    let modal = document.querySelector('.modalCriarConta');
    modal.style.display = "none";
  }

    function abrirModalUpload(e){
      e.preventDefault();
      let modal = document.querySelector('.modalUpload');
      modal.style.display = "block";
    }

    function fecharModalUpload(){
      let modal = document.querySelector('.modalUpload');
      modal.style.display = "none";
    }

    function UploadPost(e){
  //< Serve para evitar de atualizar a página que é o comportamento padrão do formulário.
      e.preventDefault();
  //< Título das postagens.
       let tituloPost = document.getElementById('tituloUpload').value;

      if (!file) {
        alert('Selecione um arquivo para fazer upload!');
        return;
      }else{
  //<  Nesse código está sendo criada uma referencia a para imagens e a parte final do código e o upload 
  //<  que está sendo feito.       
      const uploadTask = storage.ref(`images/${file.name}`).put(file);
  //<  Aqui mostra a barra de upload mudando    
      uploadTask.on("state_changed",
      function(snapshot){
  //<  Serve para mostrar a porcetagem da barra de upload. A conta é o tanto que foi transferido dividido 
  //<  pelo total do arquivo eo resulado é multiplicado por 100.    
        const progress = Math.round(snapshot.bytesTransferred/snapshot.totalBytes) *100;
  //< O setProgress serve para atualizar em tempo real  no formulário a barra de upload.   
        setProgress(progress);
      },
  //< Essa função será acionada caso tenha um erro, caso não tenha aciona a próxima função.    
      function(error){
      },
  //< Essa função é acionada quando da tudo certo.
      function(){
  //< Pega o storage e o nome do arquie e retorna em forma de promisse que tem url 
  //< o getDownloadURL da imagem, pois será adicionado no banco de dados.
        storage.ref("images").child(file.name).getDownloadURL().then(function(url){
          
  //< Chama o db que é do firestorage e pegar, inserir e atulizar os ultimos post. uma coleção é um conjuto 
  //< de documentos, se existe o post manda o titulo, image, username e timestamp no documento. Se não existe
  //< o post irá ser criado e adicionado o titulo, image, username e timestamp no documento.
          db.collection('posts').add({
            titulo: tituloPost,
            image: url,
            username: props.user,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          });
   //<   Resetar a barra de upload    
          setProgress(0);
   //<   Reseta o arquivo       
          setFile(null);
   //<   Exibe uma mesagem que o upload foi realizado com sucesso.    
          alert("Upload realizado com sucesso!");
   //<   Reseta o formulário       
          document.getElementById('form-upload').reset();
          fecharModalUpload();

        });        
      }      
    )};
      
    }  

    return(
        <div className="App">
        <div className="header">
          <div className='modalCriarConta'>
          <div className='formCriarConta'>
            <div onClick={()=>fecharModalCriar()} className="closeModalCriar">X</div>
            <h2>Criar conta</h2>
            <form onSubmit={(e)=>criarConta(e)}>
            <input id='email-cadastro' type="text" placeholder='Seu email...'/>
            <input id='username-cadastro' type="text" placeholder='Seu username...'/>
            <input id='senha-cadastro' type="password" placeholder='Sua senha...'/>
            <input type="submit" value="Criar conta!"/>
            </form>

          </div>
          </div>

          <div className='modalUpload'>
            <div className='formUpload'>
            <div onClick={(e)=>fecharModalUpload(e)} className="closeModalCriar">X</div>
            <h2>Fazer upload</h2>
            <form id="form-upload" onSubmit={(e)=>UploadPost(e)}>
              <progress id='progress-upload' value={progress}></progress>
            <input id='tituloUpload' type="text" placeholder='Nome da sua foto...'/>
            <input onChange={(e)=>setFile(e.target.files[0])} name='file' type="file"/>
            <input type="submit" value="Postar no instagram!"/>
            </form>
            </div>
          </div>

    <div className='center'>
        <div className='header__logo'>
        <a href="#" style={{textDecoration:'none', color:'black'}}> Logo </a>
        {/*         <a href="#"> <img src={logo} /> </a> */}
        </div>

    {
      (props.user)?
      <div className='header__logoInfo'>
      <span><b>{"Olá "+ props.user +", Bem-vindo"}</b></span>
      <a onClick ={(e)=>abrirModalUpload(e)} href="#">Postar!</a>
      <button className='deslogar' onClick={(e)=>deslogar(e)}>deslogar!</button>
      

      
      </div>
        :
        <div className="header__loginForm">
      <form onSubmit={(e)=>logar(e)}>
      <input id="email-login" type="text" placeholder='Login...'/>
      <input id="senha-login" type="password" placeholder='Senha...'/>
      <input type="submit" name="acao" value='Logar!'/>
      

    </form>
    <div className='btn__criarConta'>
     <a href="#" onClick={(e)=>abrirModalCriarConta(e)}>Criar conta!</a> 
    </div>
    </div>
      }
    </div>
    </div>
    </div>
    )
}
