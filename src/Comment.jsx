import { useState, useEffect } from 'react';
import styles from './stylesheets/Home.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Comment({ currPost, user, comment }) {
  const [currLikes, setLikes] = useState(comment.likes?.length || 0);
  const [liked, setLiked] = useState(false); // track if currently liked

  const data = { post: currPost, comment, user };

  // On mount, get fresh like count from backend
  useEffect(() => {

    const getLike = async () => {
      try {
        const response = await axios.put(`${import.meta.env.VITE_SERVER}/upload/get`, data);
        if (response && Array.isArray(response.data.likes)) {
          setLikes(response.data.likes.length);
          if(response.data.likes.includes(user)) setLiked(true);
          else setLiked(false)
        }
      } catch (e) {
        console.error(e);
      }
    };
    getLike();
  }, [comment, currPost, user]);

  const incLike = async () => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_SERVER}/upload/inc`, data);
      if (response && Array.isArray(response.data.likes)) {
        const newLikes = response.data.likes;
        // If likes increased, user has liked it, else user unliked it
        if(newLikes.includes(user)){
          setLiked(true);
        }
        else{
          setLiked(false);
        }
        setLikes(newLikes.length);
      }
      else{
        console.log("NOT AN ARRAY")
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.commentBox}>
      <p className={styles.commentUserId}>
        <Link to={`/user/${comment.userId}`}>@{comment.userId}</Link>{' '}
        <i>{comment.createdAt && comment.createdAt.substring(0, 10)}</i>
      </p>
      <p className={styles.commentText}>{comment.text}</p>

      <button
        className={`${styles.likes} ${liked ? styles.liked : ''}`}
        onClick={incLike}
      >
        {liked ? '♥' : '♡'} {currLikes}
      </button>
    </div>
  );
}

export default Comment;
