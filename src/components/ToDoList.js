import React, { useEffect, useState } from 'react'
import ToDoListItem from './ToDoListItem'
import dayjs from 'dayjs';

  
const ToDoList = ({setToDos, todos, setCurrentToDo, setShowModal}) => {

const [sortedToDos, setSortedToDos] = useState([]);

/**
 * Сортировка туду листа
 */
useEffect(() => {
  
  setSortedToDos(todos.sort((a, b) =>  dayjs(b.creationdate) - dayjs(a.creationdate)))

},[todos])




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
