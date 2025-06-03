import styles from './stylesheets/Post.module.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
function Post(props){

    const post = props.post;
    const setCurrPost = props.currentPostSetter;
    const setLikes = props.likesSetter;
    const setComments = props.commentSetter;
    const setPosts = props.setPosts;
    const decoded = props.decoded;
    const navigator = useNavigate();
    
    const openPost= (post)=>{
        setCurrPost(post);
        setComments(post.comments);
      }

      const handleLike = async (post) => {
        try {
          const response = await axios.put(`${import.meta.env.VITE_SERVER}/upload/updateLikes`, {
            user: decoded.name,
            caption: post.caption,
          });
      
          if (response.data.likes) {
            setPosts((prevPosts) =>
              prevPosts.map((p) =>
                p.caption === post.caption ? { ...p, likes: response.data.likes } : p
              )
            );
            setLikes(response.data.likes.length);
            //setIsLiked(response.data.likes.includes(decoded.name));
          }
        } catch (error) {
          console.error("Error updating like:", error);
        }
      };



    return(
         <div className={styles.postContainer} >
          <div onClick={()=>navigator(`/post/${post._id}`)}>
            <p className={styles.postCaptionInfo}>{post.caption}</p>
            <p className={styles.created}>Posted at {post.createdAt.toString().substring(0,10)}</p>
            <img className={styles.postImage} src={post.imageUrl} onClick={() => openPost(post)} alt="Post" />
            </div>
            <p className={styles.commentUserId}>by <Link to={`/user/${post.userId}`}>{post.userId}</Link></p>
            <p className={styles.tag}>Tag: {post.tags}</p>
            <div className={styles.activity}>
                <button 
                    className={`${styles.likes} ${post.likes?.includes(decoded.name) ? styles.liked : ''}`} 
                    onClick={() => handleLike(post)}
                >
                    {post.likes?.includes(decoded.name) ? '♥' : '♡'} {post.likes?.length || 0}
                </button>
                <button className={styles.comment} onClick={() => openPost(post)}>
                    Comment
                </button>
            </div>
        </div>
    )
}
export default Post;