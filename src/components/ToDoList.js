import React from 'react'
import ToDoListItem from './ToDoListItem'

import { useState, useEffect } from 'react'
  
const ToDoList = () => {
const [newId, setNewId] = useState(3);
const [todos, setToDos] = useState([
  {id: 1, title: "Сделать проект", descr: "приложение на React по вакансии",completed: false},
  {id: 2, title: "Сходить в магазин", descr: "купить хлеб", completed: false},
  {id: 3, title: "Изучить работу DB", descr: "MS SQL", completed: true}  
])
  
function addNewItemClick() {
    setToDos(prev => {
      console.log('before'+newId);
      setNewId(prevId => prevId + 1);
      console.log('after'+newId);
      return [{id: newId, title: "NEW ITEM "+newId, descr: "MS SQL"}, ...prev ]

    })
}

function checkItem(id) {
  
  const updatedToDos = todos.map((todo) => {
    
    if (todo.id === +id) {
      return {...todo, completed: !todo.completed}
    }
      return todo;
    })
  setToDos(updatedToDos);

  
}

function deleteToDoItem(id) {

  setToDos(todos => {
   return todos.filter(todo => todo.id !== +id)
  })
  console.log(id);

}

useEffect(() => {
  console.log(todos)
},[todos])

  return (
    <div>
      <button type='button' onClick={addNewItemClick}>+</button>
      {todos.map((todoItem) => {
          
          return <ToDoListItem 
                        deleteItem={deleteToDoItem} 
                        todoItem={todoItem}
                        checkItem={checkItem}
                        />
        })
      }

    </div>
  )
}

export default ToDoList
