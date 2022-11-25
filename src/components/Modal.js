import React from 'react'
import './Modal.css';

function Modal({showModal, setShowModal, currentToDo, setCurrentToDo }) {

    const {id, title, descr, completed } = currentToDo;
 const onCloseClick = () => {
    
    setShowModal(false);

 }
 function onModalClick(e) {

    if (e.target.className === 'modal') {
        setShowModal(false);
    }
 }
    if (!showModal) {
    return null;
    }
return (
        
        <div onClick={(e)=> onModalClick(e)} className='modal'>
            <div className="modal-window">
                <button id="modal-close-btn" className="modal-close-button" onClick={() => onCloseClick()} >&times;</button>
                <div className="modal-conteiner">
                <h1>MODAL</h1>
                
                <input type='text' className='modal-title' value={title}></input>
                <textarea rows="10" name="descr" className='modal-descr' value={descr}></textarea>
                <label htmlFor="deadline">Срок выполнения</label>
                <input type='date' name='deadline' className='modal-date'></input>
                <div className='checkbox-conteiner'>
                <input type='checkbox' name='active'></input>
                <label htmlFor="active">Выполнено</label>
                </div>
                
                <div className='modal-btn-conteiner'>
                <button className='modal-primary-btn'>Сохранить</button>     
                <button onClick={onCloseClick}>Отмена</button>

                </div>
                
                  
                </div>
                
            </div>
        </div>
  );
}

export default Modal;


