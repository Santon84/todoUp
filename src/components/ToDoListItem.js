/**
 * @module ToDoListItem
 */
import React from 'react'
import './ToDoListItem.css';
import dayjs from 'dayjs'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function ToDoListItem({setToDos, todoItem, setCurrentToDo,setShowModal}) {
  
  const {id, title, completed, deadline, descr } = todoItem; 
  const descrLenth = 55;
  const shortDescr = descr.length > descrLenth ? descr.substring(0,descrLenth)+'...' : descr;
  /**
   * Открывает модальное окно 
   * Устанавливает текущий(currentToDo) туду по которому кликнули 
   * @function openToDoModal
   * 
   */
  function openToDoModal() {
      setCurrentToDo(todoItem);
      setShowModal(prev => !prev);
  }
  

  /**
   * 
   * добавлят классы для выделения выполненного, просроченного или подходящего по срокам todo
   * @function setToDoClass
   * @param {string} toDoClass - базовый класс для туду элемента
   * @returns {string}
   */
  const setToDoClass = (toDoClass) => {

 
      toDoClass += completed ? ' completed' : '';
      
      // сравниваем даты для отображения дэдлайна
      const date1 = dayjs(deadline),
            daysLeft = Math.ceil(date1.diff(Date(), 'day',true));
      
      if (completed || !deadline) {return toDoClass}
      if (daysLeft <= 0) {
        toDoClass += ' over-deadline';
      } else if (daysLeft <= 2) {
        toDoClass += ' near-deadline';
      } 
      return toDoClass;
  }; 
  
  const toDoClass = setToDoClass('todo-list-item');
  
  /**
   * Удаление туду айтема из базы и обновление стейта todos
   * @function deleteToDo
   * @param {string} id - id туду элемента
   */
  async function deleteToDo (id) {
    
    setToDos(prev => prev.filter(item => item.id !== id));
    await deleteDoc(doc(db,'todos', id));
  }

  /**
   * Переключение статуса туду выполнено / в работе
   * @function updateStatusToDo
   * @param {string} id - id туду элемента
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
        <p className='todo-description'>{shortDescr}</p>
      </div>
      <button  onClick={(e) => deleteToDo(e.target.parentNode.dataset.key)} className='btn btn-delete' type='button'></button>
      </div>
  )
}

export default ToDoListItem
