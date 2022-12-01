import React from 'react'
import './ToDoListItem.css';
import dayjs from 'dayjs'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function ToDoListItem({setToDos, todoItem, setCurrentToDo,setShowModal}) {
  
  const {id, title, completed, deadline, descr } = todoItem; 
  
  
  /**
   * Открываем модальное окно
   */
  function openToDoModal() {
      setCurrentToDo(todoItem);
      setShowModal(prev => !prev);
  }

  // формируем имя класса для туду
  let toDoClass = 'todo-list-item';
  toDoClass += completed ? ' completed' : '';
  
  // сравниваем даты для отображения дэдлайна
  const date1 = dayjs(deadline),
        daysLeft = Math.ceil(date1.diff(Date(), 'day',true));
  if (daysLeft <= 0 && !completed) {
    toDoClass += ' over-deadline';
  } else if (deadline && daysLeft <= 2 && !completed) {
    toDoClass += ' near-deadline';
  } 
  
  /**
   * Удаление туду айтема из базы и обновление стейта todos
   * @param {string} id 
   */
  async function deleteToDo (id) {
    
    setToDos(prev => prev.filter(item => item.id !== id));
    await deleteDoc(doc(db,'todos', id));
    
    
  }

  /**
   * Переключение статуса туду выполнено / в работе
   * @param {string} id 
   */
  async function updateStatusToDo (id) {
    setToDos(prev => prev.map(item => {
      if( item.id === id) {
        return {...item, completed: !completed}
      }else {
        return item
      }

    }));
    await updateDoc(doc(db,'todos', id), {
      completed: !completed
    });

  }

  
  return (
    <div data-key={id} key={id} className={toDoClass}>
      <button  onClick={(e) => updateStatusToDo(e.target.parentNode.dataset.key)} className={todoItem.completed ? 'btn btn-check checked' : 'btn btn-check'} type='button'></button>
      <div  className='text-conteiner'>
        <a href='#edit-todo'><p className='todo-title' onClick={openToDoModal}>{title}</p></a>
        <p className='todo-description'>{descr}</p>
      </div>
      <button  onClick={(e) => deleteToDo(e.target.parentNode.dataset.key)} className='btn btn-delete' type='button'></button>
      </div>
  )
}

export default ToDoListItem
