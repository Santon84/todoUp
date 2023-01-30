//react
import React, {useState, useEffect} from 'react'
//router
import { useParams } from "react-router-dom"
import Modal from '../components/Modal';
//services
import {getTodoFromList, getList} from '../services/getData';
//components
import TodoListItem from '../components/TodoListItem';



function Todos({setIsLoading}) {
    const { idParam } = useParams();
    const [todos, setTodos] = useState([]);
    const [list, setList] = useState();
    const [showModal, setShowModal] = useState(false);
    const [currentToDo, setCurrentToDo] = useState({})
    //const [filteredToDos, setFilteredToDos] = useState('')
    const [isNewToDo, setIsNewToDo] = useState(false);
    
    //const [keyword, setKeyword] = useState('')
    

    async function onAddNewToDoClick() {

      setIsNewToDo(true);
      setShowModal(true);
    
    }
  /**
   * Открывает модальное окно 
   * Устанавливает текущий(currentToDo) туду по которому кликнули 
   * @function openToDoModal
   * 
   */
  
  useEffect(() => {
    
    //list name by id
    getList(idParam)
    .then(response => setList(response));
    
    //gettig todos in list
    getTodoFromList(idParam).then(response => setTodos(response));
    
  },[idParam]);



  

  return (
    
    <div>
      <button className='btn btn-add' onClick={onAddNewToDoClick}>+</button>
      <h2>{list?.name || 'Лист не найден'} </h2>
      <div className='top-wrapper'>
      <input type='search'></input>
      <select >
        <option value='all'>Все</option>
        <option value='work'>В работе</option>
        <option value='done'>Завершенные</option>
      </select>
      </div>
      
      {todos.map(todo => {
        return   ( 
        <TodoListItem todo={todo} setTodos={setTodos} setShowModal={setShowModal} setCurrentToDo={setCurrentToDo}/>
        )
      })}
     <Modal 
          showModal={showModal} 
          setShowModal={setShowModal}
          currentToDo={currentToDo} 
          listId = {currentToDo.listId || idParam}
          setCurrentToDo={setCurrentToDo}
          setToDos={setTodos}      
          isNewToDo={isNewToDo} 
          setIsNewToDo={setIsNewToDo}
          setIsLoading={setIsLoading}
      />
    </div>
  )
}

export default Todos
