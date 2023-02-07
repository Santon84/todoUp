//react
import React, {useState, useEffect} from 'react'
//router
import { useParams } from "react-router-dom"
import Modal from './Modal';
//services
import {getTodoFromList, getList} from '../../services/getData';
//components
import TodoListItem from './TodoListItem';
import ButtonAdd from '../../components/Buttons/ButtonAdd';
import dayjs from 'dayjs'

function Todos({setIsLoading}) {
    const { idParam } = useParams();
    const [todos, setTodos] = useState([]);
    const [list, setList] = useState();
    const [showModal, setShowModal] = useState(false);
    const [currentToDo, setCurrentToDo] = useState({})
    //const [filteredToDos, setFilteredToDos] = useState('')
    const [isNewToDo, setIsNewToDo] = useState(false);
    const [isSimpleList, setIsSimpleList ] = useState(false);
    const [keyword, setKeyword] = useState('')
    const [sortedToDos, setSortedToDos] = useState([]);
    const [filteredToDos, setFilteredToDos] = useState('');

    const filterItems = (value) => {

      switch (value) {
        case 'all' : 
          setFilteredToDos('');
          break;
        case 'done' : 
          setFilteredToDos(false);
          break;
        case 'work' : 
          setFilteredToDos(true);
          break;
    
        default: setFilteredToDos('');
    
      }
    
    }
    /**
     * Сортировка туду листа
     */
    useEffect(() => {
      
      setSortedToDos(todos.sort((a, b) =>  dayjs(b.creationdate) - dayjs(a.creationdate)))

    },[todos])



    useEffect(() => {

      setSortedToDos(todos.filter(item => {
        //console.log(item.completed !== filteredToDos ? 'not equal' : 'equal');
        return item.completed !== filteredToDos
      }))

      if (keyword !== '') {
        setSortedToDos(prev => prev.filter(item => {
          console.log(item.title);
          return item.title.toLowerCase().includes((keyword.toLowerCase())) || item.descr.toLowerCase().includes((keyword.toLowerCase()));
        }))
        
      }
    },[filteredToDos, keyword, todos])    

    
 
  


    /**
   * Getting todos from List by param in url
   */
  useEffect(() => {
    
    //list name by id
    getList(idParam)
    .then(response => {
      setIsSimpleList(response.isSimple);
      setList(response)
    });
    
    //gettig todos in list
    getTodoFromList(idParam).then(response => setTodos(response));
    
  },[idParam]);


/**
 * updating todos after modal show
 */
  useEffect(() => {
    
    //list name by id
    if(showModal) return;
    //console.log('UPDATING TODO LIST');
    //gettig todos in list
    getTodoFromList(idParam).then(response => setTodos(response));
    
  },[showModal, idParam]);



  async function onAddNewToDoClick() {

    setIsNewToDo(true);
    setShowModal(true);
  
  }

  return (
    
    <div>
      <ButtonAdd handleClick={onAddNewToDoClick} />
      <h2>{list?.name || 'Лист не найден'} </h2>
      <div className='top-wrapper'>
      <input type='search' onChange={e => setKeyword(e.target.value)}></input>
      <select onChange={(e) => filterItems(e.target.value)}>
        <option value='all'>Все</option>
        <option value='work'>В работе</option>
        <option value='done'>Завершенные</option>
      </select>
      </div>
      
      {sortedToDos.map(todo => {
        return   ( 
        <TodoListItem key={todo.id} isSimpleList={isSimpleList} todo={todo} setTodos={setTodos} setShowModal={setShowModal} setCurrentToDo={setCurrentToDo}/>
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
          isSimpleList={isSimpleList}
      />
    </div>
  )
}

export default Todos
