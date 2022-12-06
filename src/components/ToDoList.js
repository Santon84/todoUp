/**
 * @module ToDoList 
 */

import React, { useEffect, useState } from 'react'
import ToDoListItem from './ToDoListItem'
import dayjs from 'dayjs';



/**
 * 
 * @param {Array.Objects} todos - list of todos
 * @param {function} setToDos 
 * @param {function} setCurrentToDo
 * @param {function} setShowModal
 * @return {JSX.Element}
 */
const ToDoList = ({keyword, filteredToDos, setToDos, todos, setCurrentToDo, setShowModal}) => {

const [sortedToDos, setSortedToDos] = useState([]);

/**
 * Сортировка туду листа
 */
useEffect(() => {
  
  setSortedToDos(todos.sort((a, b) =>  dayjs(b.creationdate) - dayjs(a.creationdate)))



},[todos])

useEffect(() => {

  setSortedToDos(todos.filter(item => {
    return item.completed !== filteredToDos
  }))

  if (keyword !== '') {
    setSortedToDos(prev => prev.filter(item => {
      console.log(item.title);
      return item.title.toLowerCase().includes((keyword.toLowerCase())) ;
    }))
    
  }
},[filteredToDos, keyword, todos])



  return (
    <div>
      {sortedToDos.map((todoItem) => {
          return <ToDoListItem 
                        key = {todoItem.id}
                        todoItem={todoItem}
                        setCurrentToDo={setCurrentToDo}
                        setShowModal={setShowModal}
                        setToDos={setToDos}
                        />
        })
      }
    </div>
  )
}

export default ToDoList
