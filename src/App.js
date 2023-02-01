/**
 * @module App
 * @description Основной модуль для туду листа
 */
//react hooks
import { useEffect, useState } from 'react';
import {Routes, Route, Link} from 'react-router-dom'

//firebase
// import { db } from './firebase';
// import { collection, getDocs } from 'firebase/firestore';

//spinner
import BeatLoader from "react-spinners/BeatLoader";

//components

//import ToDoList from './components/ToDoList';
import Home from './pages/Home';
import Todos from './pages/Todos';

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
  // const [showModal, setShowModal] = useState(false);
  // const [currentToDo, setCurrentToDo] = useState({})
  // const [todos, setToDos] = useState([]);
  // const [filteredToDos, setFilteredToDos] = useState('')
  // const [isNewToDo, setIsNewToDo] = useState(true);
  // const [keyword, setKeyword] = useState('')
  
  const [isLoading, setIsLoading] = useState(true);
  
/**
 * Загрузка всех данных из коллекции 'todos' Firebase
 * и запись данных в todos.
 * @function loadData
 * @return void
 */
// const loadData = async() => {
//   setIsLoading(true);
//   const todoCollection = collection(db, 'todos');
//   const toDoSnapshot = await getDocs(todoCollection);
//   const toDoList = toDoSnapshot.docs.map(doc => ({...doc.data(),id: doc.id}));
//   setToDos(toDoList);
//   setIsLoading(false);
// }

/**
 * обновляем данные после открытия модального окна или изменения редактируемого туду
 * 
 */
useEffect(() => {
    // loadData();
    setIsLoading(false);
},[])

  
// const filterItems = (value) => {

//   switch (value) {
//     case 'all' : 
//       setFilteredToDos('');
//       break;
//     case 'done' : 
//       setFilteredToDos(false);
//       break;
//     case 'work' : 
//       setFilteredToDos(true);
//       break;

//     default: setFilteredToDos('');

//   }

// }


/**
 * @function onAddNewToDoClick
 * @description Открытие модального окна для добавления нового туду элемента 
 */

console.log('App render')
  return (
    <div className="App">

      <Link className='header-link' to='/'><h1>TODO LIST</h1></Link>
      
      
      
      {/* <ToDoList 
          todos={todos} 
          filteredToDos={filteredToDos}
          setToDos={setToDos} 
          setCurrentToDo={setCurrentToDo} 
          setShowModal={setShowModal}
          keyword = {keyword}
      /> */}
      <Routes>
        <Route path='*' element={<Home setIsLoading={setIsLoading}/>}/>
        <Route path='/list/:idParam' element={<><Todos setIsLoading={setIsLoading}/></>}/>
      </Routes>
      
      
      
      <BeatLoader cssOverride={override} color="#36d7b7" loading={isLoading}></BeatLoader>
      
    </div>
  );
}

export default App;
