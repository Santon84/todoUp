
import { useEffect, useState } from 'react';
import './App.css';
import Modal from './components/Modal';
import ToDoList from './components/ToDoList';
import dayjs from 'dayjs'
function App() {

  const [showModal, setShowModal] = useState(true);
  const [currentToDo, setCurrentToDo] = useState({})
  const today = new Date(2022, 11, 24);

  useEffect(() => {
    console.log(currentToDo);
  },[currentToDo]) 
  return (
    <div className="App">

      <h1>TODO LIST</h1>
      <p>{dayjs(today).format('DD-MM-YYYY')}</p>
      <input type='date' value={'2022-11-22'}></input>
      <ToDoList setCurrentToDo={setCurrentToDo} setShowModal={setShowModal}/>
      <Modal 
      showModal={showModal} 
      setShowModal={setShowModal}
      currentToDo={currentToDo} 
      setCurrentToDo={setCurrentToDo}
      />
    </div>
  );
}

export default App;
