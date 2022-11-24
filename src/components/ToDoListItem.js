import React from 'react'
import './ToDoListItem.css';


function ToDoListItem({key,title}) {
  return (
    <div key={key} className='todo-list-item'>
      <p>{title}</p>
    </div>
  )
}

export default ToDoListItem
