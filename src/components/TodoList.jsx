import React from 'react'
import { useEffect, useState } from 'react';
//services 
import {getTodoCountFromList} from '../services/getData';
import './TodoList.css'

//router
import { Link } from 'react-router-dom';

function TodoList({todoList}) {
  const [listCount, setListCount] = useState({count:0}); 
  
    
  useEffect(() => {
      getTodoCountFromList(todoList.listId)
      .then(res => setListCount({ count: res}))
    
  }, [])




  return (
    <div key={todoList.listId} className='todo-list'>
     <div  className='todo-list__text-conteiner'>
     <Link to={'list/'+todoList.listId}><p>{todoList.name}({listCount.count || 0})</p></Link>
      </div>
      <button className='btn btn-edit' type='button'></button>
      
    </div>
  )
}

export default TodoList
