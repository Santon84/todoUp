import React from 'react'
import ToDoListItem from './ToDoListItem'

import { useState } from 'react'
  
const ToDoList = () => {

const [todos, setToDos] = useState([
  {id: 1, title: "Сделать проект", descr: "приложение на React по вакансии"},
  {id: 2, title: "Сходить в магазин", descr: "купить хлеб"},
  {id: 3, title: "Изучить работу DB", descr: "MS SQL"},
  
])
  
  return (
    <div>
      {todos.map((todoitem) => {
        return <ToDoListItem setToDo={setToDos} key ={todoitem.id} title={todoitem.title}/>
      })
      
      }
    </div>
  )
}

export default ToDoList
