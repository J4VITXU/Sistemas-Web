// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import MyButton from './components/MyButton'

function App() {

  var name: string = "world 2";

  var isLoggedIn = false;
  let content;

  if (isLoggedIn) {
    content = <img src="https://via.placeholder.com/150" alt="Placeholder Image" />;
  } else {
    content = <p>Please log in to see the image.</p>;
  }

  return (
    <>
      <p>Hello {name}!!!</p>
      <MyButton />
    </>

  )
}

export default App