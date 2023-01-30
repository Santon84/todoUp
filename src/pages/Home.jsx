import React, {useState, useEffect, useMemo, useRef} from 'react'

//components 
import TodoList from '../components/TodoList.jsx';

import {getTodoLists} from '../services/getData';


function Home() {
const [todoLists, setTodoLists] = useState([]);

    

useEffect(() => {
    getTodoLists()
    .then(response => setTodoLists(response));
},[])




  return (
    <div className='home'>
        <p>Home</p>
        {todoLists.map(list => {
            return <TodoList todoList={list}/>
        })}
    </div>
  )
}

export default Home
