import React, {useState, useEffect} from 'react'


//components 
import TodoList from './TodoList.jsx';
import ListModal from './ListModal.jsx';
import ButtonAdd from '../../components/Buttons/ButtonAdd.jsx';
//services
import {getTodoLists} from '../../services/getData';


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
    //console.log(response)
    setTodoLists(response);
  })
},[showListModal])

async function onAddNewToDoClick() {

  
  setShowListModal(true);

}


  return (
    <div className='home'>
        <p>Списки задач</p>
        {todoLists.map(list => {
          //console.log(list);
            return <TodoList key={list.listId} todoList={list}/>
        })}
        <ButtonAdd handleClick={onAddNewToDoClick} />
        <ListModal setIsLoading={setIsLoading} showListModal={showListModal} setShowListModal={setShowListModal} />
    </div>
  )
}

export default Home
