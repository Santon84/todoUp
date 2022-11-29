import React from 'react'
import './ToDoListItem.css';
import dayjs from 'dayjs'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function ToDoListItem({deleteItem, todoItem, checkItem, setCurrentToDo,setShowModal}) {
  
  const {id, title, completed,deadline,descr } = todoItem; 
  function openToDoModal() {

    setCurrentToDo(todoItem);
    setShowModal(prev => !prev);
  }
  let toDoClass = 'todo-list-item';
  toDoClass += completed ? ' completed' : '';
  
  const date1 = dayjs(deadline),
        daysLeft = Math.ceil(date1.diff(Date(), 'day',true));
  

  
  if (daysLeft <= 0 && !completed) {
    toDoClass += ' over-deadline';
  } else if (deadline && daysLeft <= 2 && !completed) {
    toDoClass += ' near-deadline';
  } 
  

  async function deleteToDo (id) {
    await deleteDoc(doc(db,'todos', id));

  }
  async function updateStatusToDo (id) {
    await updateDoc(doc(db,'todos', id), {
      completed: !completed
    });

  }

  
  return (
    <div data-key={id} key={id} className={toDoClass}>
      <button  onClick={(e) => updateStatusToDo(e.target.parentNode.dataset.key)} className={todoItem.completed ? 'btn btn-check checked' : 'btn btn-check'} type='button'></button>
      <div className='text-conteiner'>
        <p className='todo-title' onClick={openToDoModal}>{title}</p>
        <p className='todo-description'>{descr}</p>
      </div>
      <button  onClick={(e) => deleteToDo(e.target.parentNode.dataset.key)} className='btn btn-delete' type='button'></button>
      </div>
  )
}

export default ToDoListItem
