import firebase from 'firebase/app';
import {useEffect, useState} from 'react';
import{db, auth} from './Firebase.js';



export default function Post(props, info){
  const[comentarios,setComentarios] = useState([]);

  function apagarComentario(e){
    e.preventDefault();
     db.collection('posts').doc(props.id).collection('comentarios').doc(comentarios[comentarios.length-1].id).delete();
    setComentarios(comentarios.slice(0,comentarios.length-1)); 
  }

/*   function apagarPost(e){
    e.preventDefault();
    db.collection('posts').doc(props.id).delete();
  } */

  useEffect(()=>{
    db.collection('posts').doc(props.id).collection('comentarios').orderBy('timestamp','asc').onSnapshot(function(snapshot){
      //- desc: o ultimo comentário fica em primeiro. O asc: o ultimo comentário fica em ultimo.
      setComentarios(snapshot.docs.map(function(document){
        return{id:document.id,info:document.data()}
      }))
    })
  },[props.id])

  

function comentar(id,e){
  e.preventDefault();
let comentarioAtual = document.querySelector("#comentario"+id).value;
  db.collection('posts').doc(id).collection('comentarios').add({
    nome:props.user,
    comentario: comentarioAtual,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
    
    
  })
  alert("Comentário enviado com sucesso.");

  comentarioAtual = document.querySelector("#comentario"+id).value = '';

}

useEffect(() => {
  setComentarios([]);
}, [props.id]);


return(
<div className="postSingle" key={info.id}>
<img src={props.info.image}/>
  <div className='divPost'>
    <h2 className="tituloPost">Título do post:</h2> 
{/*     <button className='btnExcluirPost' onClick={(e)=>apagarPost(e)}>Excluir post</button>
 */}    </div>
<p className="parageafoPost"><b>{props.info.username}</b>: {props.info.titulo}</p>
<div className='coments'>
      <h2>Últimos comentários:</h2> 
  {
    comentarios.map(function(val){
      return(
        <div className='coment-single' key={val.id}>
          <p> 
          {' '}
          <b>   {val.info.nome}</b>: {val.info.comentario}</p>
        </div>
      )
    })
  }
</div>
{
  (props.user)?
<form onSubmit={(e)=>comentar(props.id,e)}>
  <textarea id={"comentario"+props.id} placeholder='Escreva o seu comentário.'></textarea>
  <input type="submit" value="Comentar!"/>
  <button className='btnExcluir' onClick={(e)=>apagarComentario(e)}>Excluir comentário</button>
</form>
:
<div></div>
}
</div>
)
}       