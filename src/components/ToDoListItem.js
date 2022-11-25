import React from 'react'
import './ToDoListItem.css';


function ToDoListItem({deleteItem, todoItem, checkItem, setCurrentToDo,setShowModal}) {
  
  const {id, title, completed} = todoItem; 
  function openToDoModal() {

    setCurrentToDo(todoItem);
    setShowModal(prev => !prev);
  }


  return (
    <div data-key={id} key={id} className={ completed ? 'todo-list-item completed' : 'todo-list-item' }>
      <p onClick={openToDoModal}>{title}</p>
      <button  onClick={(e) => deleteItem(e.target.parentNode.dataset.key)} className='btn btn-delete' type='button'>&times;</button>
      <button  onClick={(e) => checkItem(e.target.parentNode.dataset.key)} className='btn btn-check' type='button'>&#10003;</button>
    </div>
  )
}

export default ToDoListItem
