import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./stylesheets/Signup.module.css"; 

function Signup() {
  const [name, setName] = useState("");
  const [userEmail, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [res, setRes] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.post(
        `${import.meta.env.VITE_SERVER}/app/signup`,
        { name, userEmail, password },
        { withCredentials: true }
      );
      setRes(response.data.message);
      if (response.data.message === "User created successfully") {
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (e) {
      console.log("Error block");
      setRes("Error");
    }
  };

  return (
    <div className={styles.container}>
      

      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>Signup</h2>
         <div className={styles.inputGroup}>
          <div className={styles.floating}>
          
          <input
            type="text"
            name="name"
            id="name"
            className={styles.input}
            placeholder=""
            onChange={() => setName(document.getElementById('name').value)}
          />
          <label htmlFor="name" className={styles.label}>
            Name
          </label>
          </div>
        </div>
        <div className={styles.inputGroup}>
          <div className={styles.floating}>
          
          <input
            type="email"
            name="email"
            id="email"
            className={styles.input}
            placeholder=""
            onChange={() => setEmail(document.getElementById('email').value)}
          />
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          </div>
        </div>
        <div className={styles.inputGroup}>
        <div className={styles.floating}>
          
          <i className="pass"></i>
          <input
            type="password"
            name="password"
            id="password"
            placeholder=""
            className={styles.input}
            onChange={() => setPassword(document.getElementById('password').value)}
          />
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          </div>
        </div>
        <button type="submit" className={styles.submitBtn}>
          Submit
        </button>
        <p className={styles.responseMessage}>{res?res:""}</p>
        <a href="/login" className={styles.homeLink}>Already have an account? Login here</a>
      </form>

      <div className={styles.title}>
<div className={styles.head}>LifeLoop</div>
<div className={styles.phrase}><h3>Life's a Loop, Start to Share Yours</h3></div>
</div>
    </div>
  );
}

export default Signup;
