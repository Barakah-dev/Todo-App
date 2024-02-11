let todoList =[];
let isUpdate = false;

let todoToUpdate = {};
const baseURL = 'http://localhost:5119';


async function saveTodo() {
  if (isUpdate) {    
    await updateTodo();
  }
  else{
    await createTodo();
  }  
}

async function createTodo() {
  let toDo = {
    title : '',
    desc : ''
  };

  const titleEl = document.getElementById("title");
  if (titleEl) {
    const todoIndex = todoList.findIndex(t => t.title == titleEl.value);

    if (todoIndex >= 0) {
      return;
    }

    toDo.title = titleEl.value;

    titleEl.value = '';
  }
  
  const descEl = document.getElementById("desc");
  if (descEl) {
    toDo.desc = descEl.value;

    descEl.value = '';
  }

  if (toDo.title) {
    //Make API call to perform create
    try
    {
      const createResponse = await fetch(`${baseURL}/todo/create`, {
        method: 'POST',
        body: JSON.stringify(toDo),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const createResponseBody = await createResponse.json();
      todoList.push(toDo)
      await listTodos();
      console.log(createResponseBody);
    } catch (error) {
      console.error(error);
    }
  }
  // if (toDo.title) {
  //   //console.log(isUpdate);
  //   //console.log(todoToUpdate);
  //   const todosEl = document.querySelectorAll('.todos-list');

  //   if (todosEl.length) {
  //     var newTodoItem = document.createElement('li');

  //     var todoItemTitle = document.createElement('p');
  //     todoItemTitle.innerHTML = toDo.title;

  //     newTodoItem.appendChild(todoItemTitle);

  //     var todoItemDesc = document.createElement('span');
  //     todoItemDesc.innerHTML = toDo.desc;

  //     newTodoItem.appendChild(todoItemDesc);

  //     var editBtn = document.createElement('button');
  //     editBtn.className = 'edit-btn';
  //     editBtn.innerHTML = 'Edit';

  //     editBtn.addEventListener('click', () => editTodoItem(newTodoItem));

  //     newTodoItem.appendChild(editBtn);

  //     var deleteBtn = document.createElement('button');
  //     deleteBtn.className= 'delete-btn';
  //     deleteBtn.innerHTML = 'Delete';

  //     deleteBtn.addEventListener('click', () => deleteTodoItem(newTodoItem));

  //     newTodoItem.appendChild(deleteBtn);

  //     todosEl[0].appendChild(newTodoItem);
  //     todoList.push(toDo);
  //   }
  // }
  // isUpdate = false;
}

const updateTodo = async () => {
  isUpdate = false;

    const allTodos = document.querySelectorAll('li');
    //console.log(allTodos);

    allTodos.forEach((todo) => {
      let foundTodo = false;
      todo.childNodes.forEach((child, i) => {
        //console.log(todo.childNodes);        
        if (child.id === 'todo_id') {
          //console.log(child.nodeName);
          if (child.innerHTML === todoToUpdate.id) {
            //console.log('found', child.innerHTML);
            foundTodo = true;
            // console.log(child.innerHTML);  
            // todoToUpdate.id = child.innerHTML
          }
        }

        if (child.id === 'todo_title' && foundTodo) {                   
            const titleEl = document.getElementById("title");         
            // child.innerHTML = titleEl.value;
            todoToUpdate.title = titleEl.value;           
            titleEl.value = '';       
        }

        if (child.nodeName === 'SPAN' && foundTodo) {
          //console.log(child.nodeName);
            //foundTodo = true;
            
            const descEl = document.getElementById("desc");
            // child.innerHTML = descEl.value;
            todoToUpdate.desc = descEl.value; 
            descEl.value = '';

            foundTodo = false;          
        }
      })
    });
    
    // console.log(todoToUpdate);

    //Make API call to perform update
    try
    {
      const updateResponse = await fetch(`${baseURL}/todo/update`, {
        method: 'PUT',
        body: JSON.stringify(todoToUpdate),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const responseBody = await updateResponse.json();
      await listTodos();
      console.log(responseBody);
    } catch (error) {
      console.error(error);
    }
};
  
function editTodoItem(todoLiElement) {
  //console.log('clickd');
  const titleEl = document.getElementById("title");
  const descEl = document.getElementById("desc");
  

  todoLiElement.childNodes.forEach((child) => {
    if (child.id === 'todo_id') {
      titleEl.value = child.innerHTML;
      todoToUpdate.id = child.innerHTML;
    }
    if (child.id === 'todo_title') {
      titleEl.value = child.innerHTML;
      todoToUpdate.title = child.innerHTML;
    }

    if (child.nodeName === 'SPAN') {
      descEl.value = child.innerHTML;
      todoToUpdate.value = child.innerHTML;
    }
  });

  isUpdate = true;
}
 
const listTodos = async () => {
  try {
    const response = await fetch(`${baseURL}/todo/list`);
    todoList = await response.json();
  } catch (error) {
    console.error(error);
  }

  const todosEl = document.querySelectorAll('.todos-list');

  if (todosEl.length <= 0) {
    return;
  }

  const todosBoxEl = document.querySelectorAll('.todos-box');

  if (!todosBoxEl.length) {
    return;
  }

  todosBoxEl[0].removeChild(todosEl[0]);


  const todoListElement = document.createElement('ol');
  todoListElement.className = 'todos-list';

  todoList.forEach(({ id, title, desc }) => {
      var newTodoItem = document.createElement('li');      

      var todoItemId = document.createElement('p');
      todoItemId.innerHTML = id;
      todoItemId.id= 'todo_id';
      todoItemId.style.display = 'none';

      newTodoItem.appendChild(todoItemId);

      var todoItemTitle = document.createElement('p');
      todoItemTitle.innerHTML = title;
      todoItemTitle.id= 'todo_title';

      newTodoItem.appendChild(todoItemTitle);

      var todoItemDesc = document.createElement('span');
      todoItemDesc.innerHTML = desc;

      newTodoItem.appendChild(todoItemDesc);

      var editBtn = document.createElement('button');
      editBtn.className = 'edit-btn';
      editBtn.innerHTML = 'Edit';

      editBtn.addEventListener('click', () => editTodoItem(newTodoItem));

      newTodoItem.appendChild(editBtn);

      var deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.innerHTML = 'Delete';

      deleteBtn.addEventListener('click', () => deleteTodoItem(newTodoItem));

      newTodoItem.appendChild(deleteBtn);

      todoListElement.appendChild(newTodoItem);
    })
    
    todosBoxEl[0].appendChild(todoListElement);
};

function deleteTodoItem(todoLiElement) {
  // Find the index of the todo item in the todoList array
  const index = todoList.findIndex(todo => todo.title === todoLiElement.titleEl);
  
  // Remove the todo item from the todoList array
  // if (index !== -1) {
  //   todoList.splice(index, 1);
  // }

  // // Remove the todoLiElement from the DOM
  // todoLiElement.remove();

  initiateDelete();
};

//Make an API call to initiate delete
const initiateDelete = async () => {
  try
    {
      const deleteResponse = await fetch(`${baseURL}/todo/delete`, {
        method: 'DELETE'
      });
      const deleteResponseBody = await deleteResponse.json();
      todoList.push(toDo)
      await listTodos();
      console.log(deleteResponseBody);
    } catch (error) {
      console.error(error);
    }
}


setTimeout(async() => {
  const submitButtonQueryResult = document.querySelectorAll('.btn-submit');

  if (submitButtonQueryResult.length) {
    submitButtonQueryResult[0].addEventListener('click', () => saveTodo());
  }

  try{    
    await listTodos();
    } catch (error) {
      console.error(error);
    }
    
}, 3 * 1_000);