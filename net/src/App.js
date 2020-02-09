import React from 'react';
import Blog from './conntainers/Blog/Blog'
import {BrowserRouter} from 'react-router-dom'
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Blog/>
    </BrowserRouter>
  );
}

export default App;
