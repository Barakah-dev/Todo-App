using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Dtos
{
    public class DTOs
    {
        
    }
    public record TodoDTO(string title, string description);
    public record UpdateTodoDTO(string id, string title, string description);
    public class TodoEntity
    {
        public Guid ID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
