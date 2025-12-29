import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import SignUp from '../src/auth/Signup'
import SignIn from '../src/auth/Signin'
import Dashboard from './pages/Dashboard';
function App() {
  return <div>
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<SignIn/>}/>
        <Route path="/signup"  element={<SignUp/>}/>
        <Route path="/signin" element={<SignIn/>}/>
        <Route path="/dashboard" element={<Dashboard/>} />
    </Routes>
    </BrowserRouter>
  </div>
}

export default App;
