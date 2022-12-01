import React, { useEffect, useState } from 'react'
import './Modal.css';
import {db , storage} from '../firebase';
import {ref, uploadBytes, listAll, getDownloadURL, deleteObject} from 'firebase/storage'
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import dayjs from 'dayjs';



function Modal({
    setIsLoading, 
    setIsNewToDo, 
    isNewToDo, 
    showModal, 
    setShowModal, 
    currentToDo, 
    setCurrentToDo 
}) {

const { title = '', descr = '', completed, deadline } = currentToDo;

const [filesUpload, setFilesUpload] = useState();
const [filesList, setFilesList] = useState([]);
const [deleteList, setDeleteList] = useState([]);


/**
 * Составляем список файлов в папке данного todo
 */
useEffect(() => {
    
    const filesListRef = ref(storage, currentToDo.id+"/");
    setFilesList([])
    setDeleteList([])
    setFilesUpload()

    listAll(filesListRef).then(res => {
        res.items.forEach((item, index) => {
            let fileData = {};
                        
            getDownloadURL(item).then(url => {
                fileData['url'] = url;
                fileData['name'] = item.name; 
                
                setFilesList(prev => [...prev, fileData])
                
            })            
            .catch(err => console.warn(err))
            .finally(fileData={})

        })
    })
    

},[showModal, currentToDo])



/**
 * Закрываем модальное окно и обнуляем стейты
 * 
 */
 const onCloseClick = () => {
    
    setShowModal(false);
    setCurrentToDo({});
    setIsNewToDo(false)
 }

/**
 * Обновляем поля ввода Input
 * @param {event.target} target 
 */
 function onFieldChange(target) {
    
    setCurrentToDo(prev => ({...prev, [target.name]:target.value }))
 } 



/**
 * Обновляем поле Checkbox - выполнено
 * @param {event.target} target 
 */

function onCheckChange(target) {
    
    setCurrentToDo(prev => ({...prev, [target.name]:target.checked }))
 } 




/** Функция загружает файлы находящиеся в стэйте filesUpload на сервер Firebase Storage
 * @param {string} id - идентификатор todo элемента для загрузки в формате /id/filename.file все файлы этого todo храняться в отдельной папке
 *  
 */
 async function uploadFiles(id) {
    
    
    if(!id) {return};
    for (let i=0; i<filesUpload.length; i++ ) {
    
        const filesRef = ref(storage, id+'/'+filesUpload[i].name);
        await uploadBytes(filesRef, filesUpload[i]).catch(err => console.log(err));
    };
    setFilesUpload({})
    alert('Files uploaded!')
 }
 
 /**
  * 
  * @param {string} path 
  * @param {*} files 
  */
 async function deleteFiles(path, files) {

    files.forEach(file => {
         const deleteRef = ref(storage, path+file );
         deleteObject(deleteRef).then(() => {
            
         }).catch(err => console.log(err))
    })
    
 }


 /**
  * Добавляем имя файла в массив deleteList со списком файлов для удаления.
  * И удаляем его из списка filesList файлов данного Todo
  * @param {string} fileName 
  */
 async function onFileDelete(fileName) {
    
    let newFilesList = filesList.filter(item => item.name !== fileName);
    setFilesList(newFilesList);
    setDeleteList(prev =>[...prev, fileName]);
 }

/**
 * Обработчик сохранения изменений
 * Если isNewToDo(новый туду) то создаем новый туду на бэкэнде
 * Если не новый то обносляем туду из currentToDo
 * Если есть что загрузить в filesUpload из инпута, то загружаем в storage
 * Если есть что удалить в deleteList то удаляем.
 * 
 * @param {event} e 
 */
async function onSaveClick(e) {
    if (e) {e.preventDefault()};
    setIsLoading(true);
    let dirId = '';

    if (isNewToDo) {        
        const toDoId = await addDoc(collection(db,'todos'), {
        title:currentToDo.title,
        descr:currentToDo.descr,
        deadline: !currentToDo.deadline ? '' : dayjs(currentToDo.deadline).format('YYYY-MM-DD') ,
        completed: currentToDo.completed || false,
        creationdate: dayjs(Date()).format('YYYY-MM-DD HH:mm:ss')
    });
    dirId = toDoId.id;
    
    }else    {
    await updateDoc(doc(db,'todos', currentToDo.id), {
            title: currentToDo.title,
            descr: currentToDo.descr,
            deadline: !currentToDo.deadline ? '' : dayjs(currentToDo.deadline).format('YYYY-MM-DD'),
            completed: currentToDo.completed
        } )
    dirId = currentToDo.id;   
    
    }
    
    if (filesUpload) {
        
        uploadFiles(dirId);
    } 
    
    if (deleteList) {
        await deleteFiles(dirId+'/', deleteList);
    }

    setCurrentToDo({});
    setShowModal(prev => !prev);
    setIsNewToDo(false);
    setIsLoading(false);

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
    if (!showModal) {
    return null;
    }


return (
        <div onClick={(e)=> onModalClick(e)} className='modal' >
            <div className="modal-window">
                <button id="modal-close-btn" className="modal-close-button" onClick={() => onCloseClick()} >&times;</button>
                <div className="modal-conteiner">
                    <h2>{isNewToDo ? 'Новая задача' : 'Редактировать задачу'}</h2>
                    <form onSubmit={(e) => onSaveClick(e)}>
                        <input required onChange={(e) => onFieldChange(e.target)} type='text' className='modal-title' name='title' value={title}></input>
                        <textarea required onChange={(e) => onFieldChange(e.target)} rows="10" name="descr" className='modal-descr' value={descr}></textarea>
                        <label htmlFor="deadline">Срок выполнения</label>
                        <input onChange={(e) => onFieldChange(e.target)} type='date' name='deadline' className='modal-date' value={deadline}></input>
                        
                        <div className='checkbox-conteiner'>
                            <input onChange={(e) => onCheckChange(e.target)}  id='active_check' defaultChecked={completed} type='checkbox' name='completed'></input>
                            <label htmlFor="active_check">Выполнено</label>
                        </div>
                        <ul>
                            {filesList.map((item,index) => {
                                 return <li key={index}><a target='_blank' className='filelist' href={item.url} rel="noreferrer">{item.name}</a><button data-filename={item.name} type='button' onClick={(e) => onFileDelete(e.target.dataset.filename)} className='delete-file-btn'>&times;</button></li>
                            })}
                        </ul>
                        <input multiple="multiple" name="files" type="file" onChange={(e) => setFilesUpload(e.target.files)}></input>
                        <div className='modal-btn-conteiner'>
                            <input type="submit" className='button modal-primary-btn' value="Сохранить" />
                            <button onClick={onCloseClick} className='button'>Отмена</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
  );
}

export default Modal;


