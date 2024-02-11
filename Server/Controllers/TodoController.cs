using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Server.Dtos;

namespace Server.Controllers;

[ApiController]
[Route("[controller]")]
public class TodoController : ControllerBase
{
    private readonly ILogger<TodoController> _logger;
    private static IList<TodoEntity> _todos = new List<TodoEntity>();


    public TodoController(ILogger<TodoController> logger)
    {
        _logger = logger;
       //_todos = new List<TodoEntity>();
    }

    [HttpPost("create")]
    public IActionResult CreateTodo([FromBody] TodoDTO todoDTO)
    {
        var newTodoItem = new TodoEntity
        {
            ID = Guid.NewGuid(),
            Title = todoDTO.title,
            Description = todoDTO.description,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _todos.Add(newTodoItem);
        return Ok(newTodoItem);
    }

    [HttpPut("update")]
    public IActionResult UpdateTodo([FromBody] UpdateTodoDTO updateTodoDTO)
    {
        //var todoToUpdate = FindTodo(updateTodoDTO.id);
        
        var updatedTodo = UpdateTodoEntity(updateTodoDTO);;

        if (updatedTodo is null)
        {
            return NotFound($"Todo with id {updateTodoDTO.id} not found");
        }

        // UpdateTodo(todoToUpdate, updateTodoDTO);

        return Ok();
        
    }

    [HttpGet("list")]
    public IActionResult GetTodos()
    {       
        return Ok(_todos);  
    }

    [HttpGet("get_by_id/{id}")]
    public IActionResult GetTodo(string id)
    {
        var todo = FindTodo(id);

        if (todo is null)
        {
            return NotFound($"Todo with id {id} not found");
        }
        return Ok(todo);
    }

    [HttpDelete("delete/{id}")]
    public IActionResult DeleteTodo(string id)
    {
        var todoDeleted = DeleteTodoEntity(id);
        if (!todoDeleted)
        {
            return NotFound($"Todo with id {id} not found");
        }
        
        return Ok($"Todo with id {id} has been deleted");
    }

    private TodoEntity FindTodo(string id)
    {
        var todo = _todos.FirstOrDefault(t => t.ID.ToString() == id);
        return todo;
    }

    private TodoEntity UpdateTodoEntity(UpdateTodoDTO updateTodoDTO)
    {
        var todo = _todos.FirstOrDefault(t => t.ID.ToString() == updateTodoDTO.id);

        if (todo is not null)
        {
            todo.Title = updateTodoDTO.title;
            todo.Description = updateTodoDTO.description;
            todo.UpdatedAt = DateTime.UtcNow;
        }     

        return todo;
    }

    private bool DeleteTodoEntity(string id)
    {
        var todoTodelete = _todos.FirstOrDefault(t => t.ID.ToString() == id);

        if (todoTodelete is not null)
        {
            _todos.Remove(todoTodelete);

            return true;
        }

        return false;
        
    }
}
