import React, { useState,useEffect} from 'react';
import Cookies from 'js-cookie';
import {redirect, useNavigate} from 'react-router-dom';
import axios from 'axios';
import Comment from './Comment';
import styles from './stylesheets/Home.module.css';
import { Link } from 'react-router-dom';
import { configDotenv } from 'dotenv';
import Post from './Post';

function Home() {

  axios.defaults.withCredentials = true;
  const[isAuth,setAuth] = useState(true);
  const[decoded,setDecoded]=useState({});
  const [posts,setPosts] = useState();
  const [currPost,setCurrPost] = useState();
  const [comment,setComment] = useState();
  const [currLikes,setLikes]= useState();
  const[comments,setComments]= useState();
  const navigate = useNavigate();
  const decodeTokenManually = (token) => {
    try {
      const parts = token.split('.');
  
      if (parts.length !== 3) {
        throw new Error('Invalid Token Format!');
      }
  
      // Decode Header
      const header = JSON.parse(atob(parts[0]));
  
      // Decode Payload
      const payload = JSON.parse(atob(parts[1]));
  
      // Signature
      const signature = parts[2];
      return { header, payload, signature };
    } catch (error) {
      console.log('Error decoding token:', error.message);
      return null;
    }
  };

  

  const handleCommentChange=(e)=>{
    if(e.target.value.length!=0){
      setComment(e.target.value);
    }
  }

  const nav = ()=>{
    navigate(`/post/`)
  }
  
  const getPosts = async()=>{
    try{
    const result = await axios.get(`${import.meta.env.VITE_SERVER}/upload/posts`);
    if(!result){
      console.log("No posts");
    }
    else{  
      setPosts(result.data);
      console.log(posts);
    }}
    catch(e){
      console.log(e);
    }
  } 
  

  useEffect(() => {
    const token = Cookies.get('token');
    if(!token){
      setAuth(false)
      console.error("NO TOKEN")
      navigate("/login")
    }else{
    const decoded = decodeTokenManually(token);
    setDecoded(decoded.payload);
    getPosts();
  }

    
  },[]
  );
  const handleLike = async (post) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_SERVER}/upload/updateLikes`, {
        user: decoded.name,
        caption: post.caption,
        
      });
  
      if (response.data.likes) {
        const updatedPosts = posts.map(p => 
          p.caption === post.caption ? { ...p, likes: response.data.likes } : p
        );
        setPosts(updatedPosts);

        
        if (currPost && currPost.caption === post.caption) {
          setCurrPost({ ...currPost, likes: response.data.likes });
          setLikes(response.data.likes.length);
        }
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };
  
  const removeCurrentUser = ()=>{
    setCurrPost(null);
  }
  const handleCommentPost = async()=>{
    let user = decoded.name;
    let caption = currPost.caption;
    console.log(`${user} commented "${comment}" on post "${caption}"`);
    let res;
    if(comment){
     res = await axios.put(`${import.meta.env.VITE_SERVER}/upload/updateComments`,{
      comment:comment,
      caption:caption,
      user:user,
    });}

    document.getElementById('comment').value='';
    if(res){
      setComments(res.comments);
    }



    setComment();
    window.location.reload();
  }
  const logout = ()=>{
    Cookies.remove('token');
    window.location.reload();
  }

  if(isAuth){
    return(
    <div className={styles.container}>
      <div className={styles.titleLogout}>
        <div className={styles.profileDiv }>
          <button className={styles.btn} onClick={()=>{navigate(`/user/${decoded.name}`)}} >Profile</button>
        </div>
        <div className={styles.title}>  
          <h1>Lifeloop</h1>
        </div>
        <div className={styles.logoutDiv}>
          <button className={styles.btn} onClick={logout}>Logout</button>
        </div>
        </div>
        
      <p className={styles.welcomeText}>Welcome {decoded.name}</p>
      <Link to="/upload"><button className={styles.upl}>Upload</button></Link>
      <div className={styles.posts}>

      {posts && posts.slice().reverse().map((post,index)=><Post  key={index} post={post} 
        likesSetter={setLikes} 
        setPosts = {setPosts}
        decoded = {decoded} 
        commentSetter = {setComments} 
      currentPostSetter={setCurrPost} 
      handleLike={handleLike}/>)}
      </div>
      
      
    </div>

    );
  }
  else{
    return(<div><p>You are not authorized</p></div>);
  }
}
export default Home;
