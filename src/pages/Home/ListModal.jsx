/**
 * Модальное окно для создания / редактирования ToDo элементов
 * @module Modal
 */



import React, { useEffect, useState } from 'react'
import {db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import Title from '../Todos/modal/Title';
import Button from '../Todos/modal/Button';


//router
//import { useParams } from "react-router-dom";

function ListModal({showListModal, setShowListModal, setIsLoading}) {

const [newListName,  setNewListName] = useState('');


/**
 * Закрываем модальное окно и обнуляем стейты
 * @function onCloseClick
 */
 const onCloseClick = () => {
    //beforeToDo.current = {};
    setShowListModal(false);
 } 

 useEffect(() => {
    setNewListName('');
 },[showListModal])





/**
 * Обработчик сохранения изменений
 * Если isNewToDo(новый туду) то создаем новый туду на бэкэнде
 * Если не новый то обносляем туду из currentToDo
 * Если есть что загрузить в filesUpload из инпута, то загружаем в storage
 * Если есть что удалить в deleteList то удаляем.
 * @function onSaveClick
 * @async
 * @param {event} e 
 */
async function onSaveClick(e) {
    console.log(e.target.is_simple_checkbox.checked);
    if (e) {e.preventDefault()};
    setIsLoading(true);
    //console.log(beforeToDo)
    const collectionRef = collection(db,'todoLists');
        
        await addDoc(collectionRef, {
        name:e.target.list_name.value,
        isSimple: e.target.is_simple_checkbox.checked
    });
    setShowListModal(false);
    setIsLoading(false);
 }

 function onFieldChange(e) {
    setNewListName(e.target.value);
 }

  
/**
 * Обработка клика вне модального окна
 * @param {event} e 
 */
 function onModalClick(e) {

    if (e.target.className === 'modal') {
        onCloseClick();
        }
    }

console.log('Modal render');
if (!showListModal) {
return null;
}


return (
        <div onClick={(e)=> onModalClick(e)} className='modal' >
            <div className="modal-window">
                <button id="modal-close-btn" className="modal-close-button" onClick={() => onCloseClick()} >&times;</button>
                <div className="modal-conteiner">
                    <Title title='Новый лист'/>
                    
                    <form onSubmit={(e) => onSaveClick(e)}>
                        <input name='list_name' required onChange={(e) => onFieldChange(e)} type='text' className='modal-title' value={newListName}></input>
                        <div className='checkbox-conteiner'>
                            <input name='is_simple_checkbox' type='checkbox'></input>
                            <label htmlFor="is_simple_checkbox">Упрощенный список</label>
                        </div>
                        <div className='modal-btn-conteiner'>
                            <Button value='Сохранить' type='submit' isPrimary={true}></Button>
                            <Button value='Отмена' handleClick={onCloseClick}></Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
  );
}

export default ListModal;


