import React from 'react'
import './ToDoListItem.css';


function ToDoListItem({deleteItem, todoItem, checkItem}) {
  
  const {id, title, completed} = todoItem; 
  
  return (
    <div data-key={id} key={id} className={ completed ? 'todo-list-item completed' : 'todo-list-item' }>
      <p>{title}</p>
      <button  onClick={(e) => deleteItem(e.target.parentNode.dataset.key)} className='btn btn-delete' type='button'>&times;</button>
      <button  onClick={(e) => checkItem(e.target.parentNode.dataset.key)} className='btn btn-check' type='button'>&#10003;</button>
    </div>
  )
}

export default ToDoListItem
