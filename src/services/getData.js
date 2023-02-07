
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc, query, where  } from 'firebase/firestore';



export const getTodoFromList = async(listId) => {
    //setIsLoading(true);
    
    const todoCollection = collection(db, 'todoLists', listId, 'todos');
    const toDoSnapshot = await getDocs(todoCollection);
    const toDos = toDoSnapshot.docs.map(doc => {
        return ({...doc.data(),id: doc.id, listId: listId })
    } );
    return toDos;
    
}

/**
 * @param {string} listId: 
 * @returns {integer} Count of not completed items in the list 
 */
export const getTodoCountFromList = async(listId) => {
    
    const todoInWork = query(collection(db, 'todoLists', listId, 'todos'), where("completed", "==", false));
    const toDoSnapshot = await getDocs(todoInWork);
    return toDoSnapshot.docs.length;
}



export const getTodoLists = async() => {
    //setIsLoading(true);
    const todoCollection = collection(db, 'todoLists');
    
    const toDoSnapshot = await getDocs(todoCollection);
    const toDoList = toDoSnapshot.docs.map(doc => {
        
        return ({...doc.data(),listId: doc.id})
    } );
    return toDoList;
    //setIsLoading(false);
}




export const getList = async(listId) => {
    //setIsLoading(true);
    

    const docRef = doc(db, "todoLists", listId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
    return docSnap.data();
    }
    
    
}