import React, { useEffect, useState } from 'react'
import './Modal.css';
import {db , storage} from '../firebase';
import {ref, uploadBytes, listAll, getDownloadURL, deleteObject} from 'firebase/storage'
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import dayjs from 'dayjs';



function Modal({setIsLoading, setIsNewToDo, isNewToDo, showModal, setShowModal, currentToDo, setCurrentToDo }) {

const { title, descr, completed, deadline } = currentToDo;
const [filesUpload, setFilesUpload] = useState();
const [filesList, setFilesList] = useState([]);
const [deleteList, setDeleteList] = useState([]);



console.log('completed');
console.log(completed)
const onCloseClick = () => {
    
    setShowModal(false);
    setCurrentToDo({});
    setIsNewToDo(false)
 }

 function onFieldChange(target) {
    
    setCurrentToDo(prev => ({...prev, [target.name]:target.value }))
 } 

 function onCheckChange(target) {
    
    setCurrentToDo(prev => ({...prev, [target.name]:target.checked }))
 } 

 useEffect(() => {
    const filesListRef = ref(storage, currentToDo.id+"/");
    setFilesList([])
    setDeleteList([])
    
    console.log('USE EFFECT')
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


 async function uploadFiles(id) {
    // if no files selected
    if (filesUpload == null) {
        return;
    }  
    
    for (let i=0; i<filesUpload.length; i++ ) {
    
        const filesRef = ref(storage, id+'/'+filesUpload[i].name);
        await uploadBytes(filesRef, filesUpload[i]);
    };
   
    alert('Files uploaded!')
 }

 async function deleteFiles(path, files) {

    files.forEach(file => {
         const deleteRef = ref(storage, path+file );
         deleteObject(deleteRef).then(() => {
            console.log('deleted ' +file.name);
         }).catch(err => console.log(err))
    })
    

 }
 async function onFileDelete(fileName) {
    let newFilesList = filesList.filter(item => item.name !== fileName);
 setFilesList(newFilesList);
 setDeleteList(prev =>[...prev, fileName]);


 }

 async function onSaveClick(e) {
    e.preventDefault();
    setIsLoading(true);
    let dirId = '';

    if (isNewToDo) {
        console.log(currentToDo.completed || 'false')
        const toDoId = await addDoc(collection(db,'todos'), {
        title:currentToDo.title,
        descr:currentToDo.descr,
        deadline: !currentToDo.deadline ? '' : dayjs(currentToDo.deadline).format('YYYY-MM-DD') ,
        completed: currentToDo.completed || false,
        creationdate: dayjs(Date()).format('YYYY-MM-DD HH:mm:ss')
    });
    dirId = toDoId.id;
    uploadFiles(toDoId.id);
    }else    {
    await updateDoc(doc(db,'todos', currentToDo.id), {
            title: currentToDo.title,
            descr: currentToDo.descr,
            deadline: !currentToDo.deadline ? '' : dayjs(currentToDo.deadline).format('YYYY-MM-DD'),
            completed: currentToDo.completed
        } )
    dirId = currentToDo.id;   
    
    }
    //uploading files if then exists
    uploadFiles(dirId);


    if (deleteList) {
        await deleteFiles(dirId+'/', deleteList);
    }


    setCurrentToDo({});
    setShowModal(prev => !prev);
    setIsNewToDo(false);
    setIsLoading(false);

 }
 function handleKeyPress(event) {
    if (event.key==='Enter') {
        onSaveClick();
    }
    if (event.key==='Esc') {
        onCloseClick();
        
    }
 }


 function onModalClick(e) {

    if (e.target.className === 'modal') {
        onCloseClick();
    }
 }
    if (!showModal) {
    return null;
    }
console.log(completed)
return (
        
        <div onClick={(e)=> onModalClick(e)} className='modal'>
            <div className="modal-window" onKeyPress={handleKeyPress}>
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


