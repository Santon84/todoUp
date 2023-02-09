import React from 'react'
import {  useState, useRef, useEffect } from 'react';
//services 
import {getTodoCountFromList} from '../../services/getData';
import './TodoList.css'
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';

//router
import { Link } from 'react-router-dom';

function TodoList({todoList, setTodoLists}) {
  const [listCount, setListCount] = useState({count:0}); 
  const [listName,  setListName] = useState(todoList.name)
  const inputRef = useRef();
  const deleteButtonRef = useRef();
  
  
  useEffect(() => {
      getTodoCountFromList(todoList.listId)
      .then(res => setListCount({ count: res}))
    
  }, [todoList.listId])

function handleEditClick() {

  inputRef.current.disabled = !inputRef.current.disabled;
  if (!inputRef.current.disabled) {

    inputRef.current.focus();
    
    if (!~deleteButtonRef.current.className.indexOf("active")) {
      deleteButtonRef.current.className +=' active';
    }
    
  } else 
  {
    deleteButtonRef.current.className = deleteButtonRef.current.className.replace(' active', '');
  }
}
async function handleDeleteList(id) {
  
  if (window.confirm(`Точно удалить список ${listName} задач со всеми внутренними задачами?`)) {
    
    setTodoLists(prev => {
      
      return prev.filter(item => item.listId !== id)
    });

    await deleteDoc(doc(db,'todoLists', id));
  }
}
async function handleKeyDown(e) {
  if (e.key !== 'Enter') { return }
  if (e.target.value === '' || undefined || null ) {return}
  inputRef.current.disabled = true;
  if (~deleteButtonRef.current.className.indexOf("active")) {
    deleteButtonRef.current.className = deleteButtonRef.current.className.replace(' active', '');
  }
  
  await updateDoc(doc(db,'todoLists', todoList.listId), {
    name: e.target.value
  });
  

}

  return (
    <div data-count={listCount.count} key={todoList.listId} className='todo-list'>
     <div  className='todo-list__text-conteiner'>
     <Link to={'list/'+todoList.listId}><input className='todo-list__input-name' ref={inputRef} value={listName} onKeyDown={(e) => handleKeyDown(e)} onChange={(e) => setListName(e.target.value)} disabled></input></Link>
      </div>
      <button onClick={handleEditClick} className='btn btn-edit' type='button'></button>
      <button ref={deleteButtonRef} onClick={() => handleDeleteList(todoList.listId)} type='button' name='delete-list-btn' className='delete-list-btn'>&times;</button>
        
    </div>
  )
}

export default TodoList
