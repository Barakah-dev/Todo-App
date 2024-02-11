let todoList = [];
let isUpdate = false;

const todoToUpdate = {};
const baseURL = 'http://localhost:5119';


async function saveTodo() {
    if(isUpdate) {
        await updateTodo();
    } else {
       await createTodo();
    }
}

const createTodo = async () => {
    let todo = {
        title: '',
        description: ''
    };

    const titleElement = document.getElementById("title");

    if(titleElement) {
        const todoIndex = todoList.findIndex((t) => t.title == titleElement.value);

        if(todoIndex >= 0) {
            return;
        }

        todo.title = titleElement.value;

        titleElement.value = '';
    }

    const descriptionElement = document.getElementById("description");

    if(descriptionElement) {
        todo.description = descriptionElement.value;

        descriptionElement.value = '';
    }
    
    if (todo.title) {
        //Make API call to perform create
        try {
            const createResponse = await fetch(`${baseURL}/todo/create`, {
                method: 'POST',
                body: JSON.stringify(todo),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const createResponseBody = await createResponse.json();
            todoList.push(todo);
            await listTodos();
            console.log(createResponseBody);
        } catch (error) {
            console.error(error);
        }
    }

    // if(todo.title) {
    //     const todosQueryResult = document.querySelectorAll('.todo-list');

    //     if(todosQueryResult.length) {
    //         var newTodoItem = document.createElement('li');

    //         var todoItemTitle = document.createElement('p');
    //         todoItemTitle.innerHTML = todo.title;
            
    //         newTodoItem.appendChild(todoItemTitle);

    //         var todoItemDescription = document.createElement('span');
    //         todoItemDescription.innerHTML = todo.description;
            
    //         newTodoItem.appendChild(todoItemDescription);

    //         var editButton = document.createElement('button');
    //         editButton.className = 'edit-btn';
    //         editButton.innerHTML = 'Edit';

    //         editButton.addEventListener('click', () => editTodoItem(newTodoItem));

    //         newTodoItem.appendChild(editButton);

    //         var deleteButton = document.createElement('button');
    //         deleteButton.className = 'delete-btn';
    //         deleteButton.innerHTML = 'Delete';

    //         deleteButton.addEventListener('click', () => deleteTodoItem(newTodoItem));

    //         newTodoItem.appendChild(deleteButton);

    //         todosQueryResult[0].appendChild(newTodoItem);
    //         todoList.push(todo);
    //     }
    // }
};

const updateTodo = async () => {
    isUpdate = false;

    const allTodos = document.querySelectorAll('li');
    // console.log({allTodos});

    allTodos.forEach((todo) => {
        let foundTodo = false;
        todo.childNodes.forEach((child, i) => {
            if(child.id === 'todo_id') {
                if(child.innerHTML === todoToUpdate.id) {
                    foundTodo = true;
                    // console.log(child.innerHTML)
                    // todoToUpdate.id = child.innerHTML;
                }
            }

            if(child.id === 'todo_title' && foundTodo) {
                const titleElement = document.getElementById("title");
                // child.innerHTML = titleElement.value;
                // console.log(titleElement.value);
                todoToUpdate.title = titleElement.value;
                titleElement.value = '';
            }

            if(child.nodeName === 'SPAN' && foundTodo) {
                const descriptionElement = document.getElementById("description");
                // child.innerHTML = descriptionElement.value;
                todoToUpdate.description = descriptionElement.value;
                // console.log(descriptionElement.value);
                descriptionElement.value = '';

                foundTodo = false;
            }
        })
    });

    console.log(todoToUpdate);

    // Make API call to perform update
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
    // console.log('Todo item clicked ', el);
    const titleElement = document.getElementById("title");
    const descriptionElement = document.getElementById("description");

    // titleElement.value = 

    todoLiElement.childNodes.forEach((child) => {
        if(child.id === 'todo_id') {
            titleElement.value = child.innerHTML;
            todoToUpdate.id = child.innerHTML;
        }

        if(child.id === 'todo_title') {
            titleElement.value = child.innerHTML;
            todoToUpdate.title = child.innerHTML;
        }

        if(child.nodeName === 'SPAN') {
            descriptionElement.value = child.innerHTML
            todoToUpdate.description = child.innerHTML;
        }
    });

    isUpdate = true;
}

const listTodos = async () => {
    const response = await fetch(`${baseURL}/todo/list`);
    todoList = await response.json();

    const todosQueryResult = document.querySelectorAll('.todo-list');

    
    if(todosQueryResult.length <= 0) {
        return;
    }

    const todoBoxQueryResult = document.querySelectorAll('.todo-box');

    if(!todoBoxQueryResult.length) {
        return;
    }

    todoBoxQueryResult[0].removeChild(todosQueryResult[0]);



    const todoListElement = document.createElement('ol');
    todoListElement.className = 'todo-list';

    todoList.forEach(({ id, title, description }) => {
        var newTodoItem = document.createElement('li');

        var todoItemId = document.createElement('p');
        todoItemId.innerHTML = id;
        todoItemId.id = 'todo_id'
        todoItemId.style.display = 'none';

        newTodoItem.appendChild(todoItemId);

        var todoItemTitle = document.createElement('p');
        todoItemTitle.innerHTML = title;
        todoItemTitle.id = 'todo_title'
        
        newTodoItem.appendChild(todoItemTitle);

        var todoItemDescription = document.createElement('span');
        todoItemDescription.innerHTML = description;
        
        newTodoItem.appendChild(todoItemDescription);

        var editButton = document.createElement('button');
        editButton.className = 'edit-btn';
        editButton.innerHTML = 'Edit';

        editButton.addEventListener('click', () => editTodoItem(newTodoItem));

        newTodoItem.appendChild(editButton);

        var deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.innerHTML = 'Delete';

        deleteButton.addEventListener('click', () => deleteTodoItem(newTodoItem));

        newTodoItem.appendChild(deleteButton);

        todoListElement.appendChild(newTodoItem);
    })

    todoBoxQueryResult[0].appendChild(todoListElement);
}

// function titleChanged(e) {
//     const titleElementQueryResult = document.querySelectorAll("#title");

//     console.log(titleElementQueryResult);
    
// }

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
  


setTimeout(async () => {
    const submitButtonQueryResult = document.querySelectorAll('.btn-submit');

    if(submitButtonQueryResult.length) {
        submitButtonQueryResult[0].addEventListener('click', () => saveTodo());
    }

    try 
    {
        await listTodos();
    } catch(error) {
        console.error(error.message)
    }
    
}, 3 * 1_000);