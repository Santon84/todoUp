import React from 'react'
import {  useState, useRef } from 'react';
//services 
//import {getTodoCountFromList} from '../services/getData';
import './TodoList.css'
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

//router
import { Link } from 'react-router-dom';

function TodoList({todoList}) {
  //const [listCount, setListCount] = useState({count:0}); 
  const [listName,  setListName] = useState(todoList.name)
  const inputRef = useRef();
    
  // useEffect(() => {
  //     getTodoCountFromList(todoList.listId)
  //     .then(res => setListCount({ count: res}))
    
  // }, [todoList.listId])

function handleEditClick() {

  inputRef.current.disabled = !inputRef.current.disabled;
  inputRef.current.focus();
}

async function handleKeyDown(e) {

  if (e.key !== 'Enter') { return }
  if (e.target.value === '' || undefined || null ) {return}
  inputRef.current.disabled = true;
  await updateDoc(doc(db,'todoLists', todoList.listId), {
    name: e.target.value
  });
  

}

  return (
    <div key={todoList.listId} className='todo-list'>
     <div  className='todo-list__text-conteiner'>
     <Link to={'list/'+todoList.listId}><input className='todo-list__input-name' ref={inputRef} value={listName} onKeyDown={handleKeyDown} onChange={(e) => setListName(e.target.value)} disabled></input></Link>
     {/* <Link to={'list/'+todoList.listId}><p>{todoList.name}({listCount.count || 0})</p></Link> */}
      </div>
      <button onClick={handleEditClick} className='btn btn-edit' type='button'></button>
      
    </div>
  )
}

export default TodoList
