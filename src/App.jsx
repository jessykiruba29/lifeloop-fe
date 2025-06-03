import {Routes,Route,BrowserRouter} from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import FileUpload from './FileUpload';
import Profile from './Profile';
import { configDotenv } from 'dotenv';
import PagePost from './PagePost';
function App() {
  return (
      <BrowserRouter>
      <Routes>
      <Route path = '/' Component={Home} ></Route>
      <Route path = '/login' Component={Login}/>
      <Route path='/signup' Component={Signup}></Route>
      <Route path='/upload' Component={FileUpload}></Route>
      <Route path= '/user/:id' Component={Profile}></Route>
      <Route path= '/post/:id' Component = {PagePost}></Route>
      </Routes>
      </BrowserRouter>
  )
}

export default App
