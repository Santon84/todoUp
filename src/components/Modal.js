/**
 * Модальное окно для создания / редактирования ToDo элементов
 * @module Modal
 */



import React, { useEffect, useState, useRef } from 'react'
import './Modal.css';
import {db , storage} from '../firebase';
import {ref, uploadBytes, listAll, getDownloadURL, deleteObject} from 'firebase/storage'
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import dayjs from 'dayjs';
import Title from './modal/Title';
import Button from './modal/Button';
import File from './modal/File'

function Modal({
    setIsLoading, 
    setIsNewToDo, 
    isNewToDo, 
    showModal, 
    setShowModal, 
    currentToDo, 
    setCurrentToDo,
    setToDos 
}) {

const { title = '', descr = '', completed, deadline } = currentToDo;

console.log('updating '+ title);

const titleRef = useRef();
const [isEdited, setIsEdited] = useState(false);








/**
 * HTMLInputElement.files: FileList 
 * 
 * {FileList} filesUpload
 * 
 */
const [filesUpload, setFilesUpload] = useState();

/**
 * filesList - список файлов прикрепленных к туду
*/
const [filesList, setFilesList] = useState([]);
/**
 * deleteList - список файлов на удаление
 */
const [deleteList, setDeleteList] = useState([]);



/**
 * Составляем список файлов в папке данного todo
 */
useEffect(() => {
    if (showModal) {
        console.log('getData')
        setIsEdited(false);
        // beforeToDo.current = clone(currentToDo);
        //rememberState();
        const filesListRef = ref(storage, currentToDo.id+"/");
        setFilesList([])
        setDeleteList([])
        setFilesUpload()
        titleRef.current.focus();
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
    
    
}
},[showModal, currentToDo.id])



/**
 * Закрываем модальное окно и обнуляем стейты
 * @function onCloseClick
 */
 const onCloseClick = () => {
    //beforeToDo.current = {};
    setShowModal(false);
    setIsEdited(false);
    setCurrentToDo({});
    if (isNewToDo) { setIsNewToDo(false) };
 }

/**
 * Обновляем поля ввода Input
 * @function onFieldChange
 * @param {event.target} target target input
 */
 function onFieldChange(target) {
    if (!isEdited) {setIsEdited(true)}
    setCurrentToDo(prev => ({...prev, [target.name]: target.type === 'checkbox' ? target.checked : target.value }))
 } 



/**
 * Обновляем поле Checkbox - выполнено
//  * @function onCheckChange
//  * @param {event.target} target checkbox
//  */

// function onCheckChange(target) {
    
//     setCurrentToDo(prev => ({...prev, [target.name]:target.checked }))
//  } 




/** Функция загружает файлы находящиеся в стэйте filesUpload на сервер Firebase Storage
 * @function uploadFiles
 * 
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
  * Удаление файлов из storage
  * @function deleteFiles
  * @async
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
  * @function onFileDelete
  * @async
  * @param {string} fileName - Имя файла
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
 * @function onSaveClick
 * @async
 * @param {event} e 
 */
async function onSaveClick(e) {
    if (e) {e.preventDefault()};
    //console.log(beforeToDo)
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
    setToDos(prev => {
        return [...prev, {...currentToDo, id: dirId}]
     })
    
    
    }else    
    {   
        if (isEdited) {
            await updateDoc(doc(db, 'todos', currentToDo.id), {
                title: currentToDo.title,
                descr: currentToDo.descr,
                deadline: !currentToDo.deadline ? '' : dayjs(currentToDo.deadline).format('YYYY-MM-DD'),
                completed: !currentToDo.completed ? false : currentToDo.completed
            })
            

            setToDos(prev => {
                return prev.map(item => {
                    if (item.id === currentToDo.id) {
                        return currentToDo
                    } else {
                        return item;
                    }
                })
            })
        }
        dirId = currentToDo.id;
    }
    
    

    if (filesUpload) {
        
        await uploadFiles(dirId);
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

console.log('Modal render');
if (!showModal) {
return null;
}


return (
        <div onClick={(e)=> onModalClick(e)} className='modal' >
            <div className="modal-window">
                <button id="modal-close-btn" className="modal-close-button" onClick={() => onCloseClick()} >&times;</button>
                <div className="modal-conteiner">
                    <Title title={isNewToDo ? 'Новая задача' : 'Редактировать задачу'}/>
                    
                    <form onSubmit={(e) => onSaveClick(e)}>
                        <input ref={titleRef} required onChange={(e) => onFieldChange(e.target)} type='text' className='modal-title' name='title' value={title}></input>
                        <textarea required onChange={(e) => onFieldChange(e.target)} rows="10" name="descr" className='modal-descr' value={descr}></textarea>
                        <label htmlFor="deadline">Срок выполнения</label>
                        <input onChange={(e) => onFieldChange(e.target)} type='date' name='deadline' className='modal-date' value={deadline}></input>
                        
                        <div className='checkbox-conteiner'>
                            <input onChange={(e) => onFieldChange(e.target)}  id='active_check' defaultChecked={completed} type='checkbox' name='completed'></input>
                            <label htmlFor="active_check">Выполнено</label>
                        </div>
                        <ul>
                            {
                            filesList.map((item,index) => <File item= {item} index={index} handleClick={onFileDelete} />
                            )}
                        </ul>
                        <input multiple="multiple" name="files" type="file" onChange={(e) => setFilesUpload(e.target.files)}></input>
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

export default Modal;


