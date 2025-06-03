
import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, redirect, useNavigate, useParams } from "react-router-dom";
import Comment from "./Comment";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import styles from "./stylesheets/Home.module.css"


//It has seperate url for each post
function PagePost(){



    const navigator = useNavigate();
    const [currPost,setCurrPost] = useState();
      const[decoded,setDecoded]=useState();
      const [ comment,setComment] = useState();
    let {id} = useParams();

      //Typing the comment

      const handleCommentChange = (e)=>{
        setComment(e.target.value);
      }

      //Commenting on a post

      const handleCommentPost = async()=>{
        let user = decoded.name;
        let caption = currPost.caption;
        console.log(`${user} commented "${comment}" on post "${caption}"`);
        let res;
        if(comment && new String(comment).trim().length!=0){
         res = await axios.put(`${import.meta.env.VITE_SERVER}/upload/updateComments`,{
          comment:comment,
          caption:caption,
          user:user,
        });}
    
        document.getElementById('comment').value='';
        if(res){
          setCurrPost({ ...currPost, comments: res.data.comments });
        }
      }

    //post like
    const handleLike = async () => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_SERVER}/upload/updateLikes`, {
        user: decoded.name,
        caption: currPost.caption,
        
      });
  
      if (response.data.likes) {
          setCurrPost({ ...currPost, likes: response.data.likes });
      }
      else{
        console.log("FAILED")
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };


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
    useEffect(()=>{const token = Cookies.get('token');
        if(!token){
          console.error("NO TOKEN")
          navigator("/login");
        }else{
        const decoded = decodeTokenManually(token);
        setDecoded(decoded.payload);}
        let p = getPost();
        setCurrPost(p);
    },[])

    const getPost = async()=>{
        const url = `${import.meta.env.VITE_SERVER}/upload/post/${id}`;
        const post =await axios.get(url);
        if(!post) redirect("/");
        setCurrPost(post.data[0]);  
        return post.data[0];
    }
    
    if(!currPost ){
        return(<div>Reloading</div>)
    }
    else{
    return( 
     <div className={styles.postInfoDiv}>
        <div className={styles.postInfo}>
            <div className={styles.postHeaders}>
            <p className={styles.postCaptionInfo}>{currPost.caption}</p>
            <button className={styles.closeButton} onClick={()=>{navigator(`/`)}}>close</button></div>
            <br />
            <img className={styles.postImageInfo} src={currPost.imageUrl}></img>
            <p className={styles.commentUserId}>by <Link to={`/user/${currPost.userId}`}>{currPost.userId}</Link></p>
            <p className={styles.tagInfo}>Tag: {currPost.tags}</p>
            <br />
            <button 
              className={`${styles.likes} ${currPost.likes?.includes(decoded.name) ? styles.liked : ''}`}
              onClick={handleLike}
            >
              {currPost.likes?.includes(decoded.name) ? '♥' : '♡'} {currPost.likes?.length || 0}
            </button>
         </div> 
         <div className={styles.commentSection}>
          <div className={styles.stickyDiv}>
                <p className={styles.commentHeader}>Comments</p>
            <input type="text" name="comment" id="comment" className={styles.comment} onChange={handleCommentChange}  />
            <button className={styles.sendButton} onClick={handleCommentPost} >Send</button>
            </div>
            {currPost.comments && currPost.comments.map((comment,index)=><Comment key={index} user = {decoded.name} currPost = {currPost} comment={comment}/>
              )}
            <br />
          </div>
      </div>
      )}
}
export default PagePost;