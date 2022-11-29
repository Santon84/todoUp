
import { useEffect, useState } from 'react';
import './App.css';
import Modal from './components/Modal';
import ToDoList from './components/ToDoList';
import {db} from './firebase';
import BeatLoader from "react-spinners/BeatLoader";

import { query, collection, onSnapshot } from 'firebase/firestore';
function App() {

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
  const [showModal, setShowModal] = useState(false);
  const [currentToDo, setCurrentToDo] = useState({})
  const [todos, setToDos] = useState([]);
  const [isNewToDo, setIsNewToDo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [todos2, setToDos2] = useState([
  //   {id: 1, title: "Сделать проект", descr: "приложение на React по вакансии",completed: false, deadline: '2022-11-23'},
  //   {id: 2, title: "Сходить в магазин", descr: "купить хлеб", completed: false, deadline: '2022-11-26'},
  //   {id: 3, title: "Изучить работу DB", descr: "MS SQL", completed: true, deadline: '2022-11-25'}  
  // ])
  
  
async function loadData () {
    
    const q = query(collection(db, "todos"));
    onSnapshot(q,(querySnapshot) => {

      let newToDo = [];
      querySnapshot.forEach(doc => {
        
        newToDo.push({ ...doc.data(), id: doc.id})
      })
      setToDos(newToDo)
      setIsLoading(false);
    })
    
  }
  const f = async (callback) => {
    setIsLoading(true);
    await callback();
    
  }
  useEffect(() => {
    f(loadData);
    
  },[showModal])
  
  
  async function handleClick(e) {

    // await addDoc(collection(db,'todos'), {
    //   title:'todo Adding',
    //   descr: 'new description'
    setIsNewToDo(true);
    setShowModal(true);
    // })

  }

  return (
    <div className="App">

      <h1>TODO LIST</h1>
      <button className='btn btn-add' onClick={handleClick}>+</button>
      
      <ToDoList todos={todos} setToDos={setToDos} setCurrentToDo={setCurrentToDo} setShowModal={setShowModal}/>
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
