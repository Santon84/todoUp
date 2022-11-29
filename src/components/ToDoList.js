import React from 'react'
import ToDoListItem from './ToDoListItem'
import dayjs from 'dayjs';

  
const ToDoList = ({setToDos, todos, setCurrentToDo,setShowModal}) => {


  
// async function addNewToDoItem() {
  
//   setNewId(prevId => prevId + 1, ()=> {
//     setToDos(prev => {
      
//       return [{id: newId, title: "NEW ITEM "+newId, descr: "MS SQL"}, ...prev ];
//       })
//   })
  
// }

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
  

}






  return (
    <div>
      {todos.sort((a, b) =>  dayjs(b.creationdate) - dayjs(a.creationdate)).map((todoItem) => {
          
          return <ToDoListItem 
                        deleteItem={deleteToDoItem} 
                        todoItem={todoItem}
                        checkItem={checkItem}
                        setCurrentToDo={setCurrentToDo}
                        setShowModal={setShowModal}
                        />
        })
      }

    </div>
  )
}

export default ToDoList
