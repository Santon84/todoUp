/**
 * @module App
 * @description Основной модуль для туду листа
 */
//react hooks
import { useEffect, useState } from 'react';

//firebase
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

//spinner
import BeatLoader from "react-spinners/BeatLoader";

//components
import Modal from './components/Modal';
import ToDoList from './components/ToDoList';

//styles
import './App.css';
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
  const [filteredToDos, setFilteredToDos] = useState('')
  const [isNewToDo, setIsNewToDo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [keyword, setKeyword] = useState('')
  
  
/**
 * Загрузка всех данных из коллекции 'todos' Firebase
 * и запись данных в todos.
 * @function loadData
 * @return void
 */
const loadData = async() => {
  setIsLoading(true);
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
    console.log('App load data')
},[])

  
const filterItems = (value) => {

  switch (value) {
    case 'all' : 
      setFilteredToDos('');
      break;
    case 'done' : 
      setFilteredToDos(false);
      break;
    case 'work' : 
      setFilteredToDos(true);
      break;

    default: setFilteredToDos('');

  }

}


/**
 * @function onAddNewToDoClick
 * @description Открытие модального окна для добавления нового туду элемента 
 */
async function onAddNewToDoClick() {

    setIsNewToDo(true);
    setShowModal(true);

}
console.log('App render')
  return (
    <div className="App">

      <h1>TODO LIST</h1>
      <button className='btn btn-add' onClick={onAddNewToDoClick}>+</button>
      
      <div className='top-wrapper'>
      <input type='search' onChange={e => setKeyword(e.target.value)}></input>
      <select onChange={(e) => filterItems(e.target.value)}>
        <option value='all'>Все</option>
        <option value='work'>В работе</option>
        <option value='done'>Завершенные</option>
      </select>
      </div>
      <ToDoList 
          todos={todos} 
          filteredToDos={filteredToDos}
          setToDos={setToDos} 
          setCurrentToDo={setCurrentToDo} 
          setShowModal={setShowModal}
          keyword = {keyword}
      />
      <Modal 
          showModal={showModal} 
          setShowModal={setShowModal}
          currentToDo={currentToDo} 
          setCurrentToDo={setCurrentToDo}
          setToDos={setToDos}      
          isNewToDo={isNewToDo} 
          setIsNewToDo={setIsNewToDo}
          setIsLoading={setIsLoading}
      />
      <BeatLoader cssOverride={override} color="#36d7b7" loading={isLoading}></BeatLoader>
      
    </div>
  );
}

export default App;
