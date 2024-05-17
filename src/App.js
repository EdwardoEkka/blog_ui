import React from "react";
import Main_log from "./components/main_log";
import {BrowserRouter as Router,Route, Routes,Navigate} from "react-router-dom";
import Write from "./components/write";
import Update from "./components/update";
import ParentComponent from "./components/Parent";
import HideAppBar from './components/navbar';
import View from "./components/view";
import { UserProvider } from './userContext';
import Read from "./components/read";
import Home from "./components/home";



function App() {
  return (
    <div className="App">
      <Router>
      <UserProvider>
      <HideAppBar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/main_log' element={<Main_log/>}/>
          <Route path='/write' element={<Write/>}/>
          <Route path='/update' element={<Update/>}/>
          <Route path='/parent' element={<ParentComponent/>}/>
          <Route path='/view' element={<View/>}/>
          <Route path='/read' element={<Read/>}/>
          
        </Routes>
      </UserProvider>
      </Router>
      
    </div>
  );
}
export default App;