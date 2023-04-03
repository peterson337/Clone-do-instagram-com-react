import './App.css';
import {useEffect, useState} from 'react';
import{db, auth} from './Firebase.js';
import Header from './Header.js';
import Post from './Post';
import Footer from './footer'

export default  function App() {
  const [user, setUser] = useState();
  const [posts,setPosts] =  useState([]);
  
  useEffect(()=>{
    
    auth.onAuthStateChanged(function(val){
      if(val != null){
    setUser(val.displayName);
  }
    })
  },[])
//<  serve para atualizar estado so post quando alguma coisa é inserido, excluido e atualizado.
db.collection('posts').orderBy('timestamp','desc').onSnapshot(function(snapshot){
  setPosts(snapshot.docs.map(function(document){
    return{id:document.id,info:document.data()}
  }))
})
  return (
    <div className="App">
    <Header setUser={setUser} user={user}></Header>
    {
      posts.map(function(val){
        return(
          <Post user={user} setUser={setUser} info={val.info} id={val.id} key={val.id}></Post>
        )
      })
    }
    <Footer></Footer>
   
    </div>
  );
}
