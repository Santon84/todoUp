/**
 * @module App
 * @description Основной модуль для туду листа
 */
import { useEffect, useState } from 'react';
import './App.css';
import Modal from './components/Modal';
import ToDoList from './components/ToDoList';
import {db} from './firebase';
import BeatLoader from "react-spinners/BeatLoader";

import { collection, getDocs } from 'firebase/firestore';

/**
 * 
 * @function App
 * @return {JSX.Element}
 */
function App() {

/**
 * Стили для значка загрузки
 * @constant {Object} override
 */
  const override = {
    position: "absolute",
    zIndex:"9999",
    top:0,
    left:0,
    height: "100%",
    width: "100%",
    backgroundColor:"rgba(0,0,0,.4)",
    display: "flex",
    justifyContent: "center",
    alignItems:"center",
    borderColor: "red",
  };

  /**
   * 
   */
  const [showModal, setShowModal] = useState(false);
  const [currentToDo, setCurrentToDo] = useState({})
  const [todos, setToDos] = useState([]);
  const [isNewToDo, setIsNewToDo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  
  
/**
 * Загрузка всех данных из коллекции 'todos' Firebase
 * и запись данных в todos.
 * @function loadData
 * @return void
 */
const loadData = async() => {
  
  const todoCollection = collection(db, 'todos');
  const toDoSnapshot = await getDocs(todoCollection);
  const toDoList = toDoSnapshot.docs.map(doc => ({...doc.data(),id: doc.id}));
  setToDos(toDoList);
  setIsLoading(false);
}

/**
 * обновляем данные после открытия модального окна или изменения редактируемого туду
 * 
 */
useEffect(() => {
    
    loadData();
  
},[showModal,currentToDo])

  



/**
 * @function onAddNewToDoClick
 * @description Открытие модального окна для добавления нового туду элемента 
 */
async function onAddNewToDoClick() {

    setIsNewToDo(true);
    setShowModal(true);

}

  return (
    <div className="App">

      <h1>TODO LIST</h1>
      <button className='btn btn-add' onClick={onAddNewToDoClick}>+</button>
      
      <ToDoList 
          todos={todos} 
          setToDos={setToDos} 
          setCurrentToDo={setCurrentToDo} 
          setShowModal={setShowModal}
      />
      <Modal 
          showModal={showModal} 
          setShowModal={setShowModal}
          currentToDo={currentToDo} 
          setCurrentToDo={setCurrentToDo}
          setToDos={setToDos}
          todos={todos}
          isNewToDo={isNewToDo} 
          setIsNewToDo={setIsNewToDo}
          setIsLoading={setIsLoading}
      />
      <BeatLoader cssOverride={override} color="#36d7b7" loading={isLoading}></BeatLoader>
      
    </div>
  );
}

export default App;
