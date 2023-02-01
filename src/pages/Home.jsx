import React, {useState, useEffect} from 'react'
import AddNewListModal from '../components/AddNewListModal.jsx';

//components 
import TodoList from '../components/TodoList.jsx';

import {getTodoLists} from '../services/getData';


function Home({setIsLoading}) {
const [todoLists, setTodoLists] = useState([]);
const [showListModal, setShowListModal] = useState(false);
    

useEffect(() => {
    getTodoLists()
    .then(response => setTodoLists(response));
},[])

useEffect(() => {
  if (showListModal) return;

  getTodoLists()
  .then(response => {
    console.log(response)
    setTodoLists(response);
  })
},[showListModal])

async function onAddNewToDoClick() {

  
  setShowListModal(true);

}


  return (
    <div className='home'>
        <p>Home</p>
        {todoLists.map(list => {
          console.log(list);
            return <TodoList key={list.listId} todoList={list}/>
        })}
        <button className='btn btn-add' onClick={onAddNewToDoClick}>+</button>
        <AddNewListModal setIsLoading={setIsLoading} showListModal={showListModal} setShowListModal={setShowListModal}></AddNewListModal>
    </div>
  )
}

export default Home
