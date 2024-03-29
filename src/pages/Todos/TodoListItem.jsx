
import './ToDoListItem.css'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
//import { useEffect } from 'react';
import dayjs from 'dayjs'

function TodoListItem({todo, setTodos, setShowModal, setCurrentToDo, isSimpleList}) {
    

    function openToDoModal() {
       // alert('MODAL');
        setCurrentToDo(todo);
        setShowModal(prev => !prev);
    }
    const setToDoClass = (toDoClass) => {

 
      toDoClass += todo.completed ? ' completed' : '';
      
      // сравниваем даты для отображения дэдлайна
      const date1 = dayjs(todo?.deadline),
            daysLeft = Math.ceil(date1.diff(Date(), 'day',true));
      
      if (todo?.completed || !todo?.deadline) {return toDoClass}
      if (daysLeft <= 0) {
        toDoClass += ' over-deadline';
      } else if (daysLeft <= 2) {
        toDoClass += ' near-deadline';
      } 
      return toDoClass;
    }; 
  
    const toDoClass = setToDoClass('todo-list-item');
    async function deleteToDo (id) {

      if (window.confirm('Точно удалить задачу?')) {
        setTodos(prev => {
          
          return prev.filter(item => item.id !== id)
        });
        await deleteDoc(doc(db,'todoLists', todo.listId, 'todos', id));
      }
    }
    /**
   * Переключение статуса туду выполнено / в работе
   * @function updateStatusToDo
   * @param {string} id - id туду элемента
   */
    async function updateStatusToDo (id) {
      setTodos(prev => prev.map(item => {
        if( item.id === id) {
          return {...item, completed: !todo.completed}
        }else {
          return item
        }
  
      }));
      await updateDoc(doc(db,'todoLists', todo.listId, 'todos', id), {
        completed: !todo.completed
      });
  
    }
   
  return (
    <div>
      <div data-key={todo.id} key={todo.id} className={toDoClass}>
        <button  className={todo.completed ? 'btn btn-check checked' : 'btn btn-check'} type='button' onClick={() => updateStatusToDo(todo.id)}></button>
        <div  className='text-conteiner'>
          <a href='#edit-todo' ><p className='todo-title' onClick={openToDoModal}>{todo?.title}</p></a>
          {isSimpleList ? '' : <p className='todo-description'>{todo?.descr}</p>}
        </div>
        <button onClick={() => deleteToDo(todo.id)} className='btn btn-delete' type='button'></button>
        </div>
    </div>
  )
}

export default TodoListItem
