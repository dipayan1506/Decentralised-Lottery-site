import React from 'react';
import Home from './components/Home';
// import PickWinner from './components/PickWinner';
import Winner from './components/Winner';
import { Routes, Route, Link} from 'react-router-dom';
import './App.css';

class App extends React.Component {




  render(){
  return(
 
     
    <div>
    <nav>
      <ul>
        <li>
        <Link to="/">Home</Link>
        </li>
        <li>
               <Link to="/Winner">PickWinner</Link>

        </li>
      </ul>
</nav>


      <Routes>
         <Route path="/Winner" element={<Winner />}></Route>
         <Route path="/" element={<Home />}></Route>
       </Routes>
    



    </div>
  );
}
}
export default App;