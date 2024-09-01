"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [todos, setTodos] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  // Fetch todos from the API
  useEffect(() => {
    console.log("Fetching todos from the API...");
    axios
      .get("http://localhost:3000/api/todo")  // Make sure the backend is running on port 8000
      .then((response) => {
        console.log("Received todos:", response.data);
        setTodos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching todos:", error);
        alert("Failed to fetch todos.");
      });
  }, []);

  // Add or update a todo
  const addTodo = () => {
    console.log("Attempting to add/update todo...");
    if (editId === null) {
      console.log("Adding new todo:", { name, description });
      axios
        .post("http://localhost:3000/api/todo/add", { name, description })
        .then((response) => {
          console.log("Added new todo:", response.data);
          setTodos([...todos, response.data]);
          setName("");
          setDescription("");
          alert("Todo added successfully!");
        })
        .catch((error) => {
          console.error("Error adding todo:", error);
          alert("Failed to add todo.");
        });
    } else {
      console.log("Updating todo:", { id: editId, name, description });
      axios
        .put(`http://localhost:3000/api/todo/update/${editId}`, {
          name,
          description,
        })
        .then((response) => {
          console.log("Updated todo:", response.data);
          setTodos(
            todos.map((todo) => (todo.id === editId ? response.data : todo))
          );
          setName("");
          setDescription("");
          setEditId(null);
          alert("Todo updated successfully!");
        })
        .catch((error) => {
          console.error("Error updating todo:", error);
          alert("Failed to update todo.");
        });
    }
  };

  // Delete a todo
  const deleteTodo = (id: number) => {
    console.log("Attempting to delete todo with id:", id);
    axios
      .delete(`http://localhost:3000/api/todo/delete/${id}`)
      .then(() => {
        console.log("Deleted todo with id:", id);
        setTodos(todos.filter((todo) => todo.id !== id));
        alert("Todo deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting todo:", error);
        alert("Failed to delete todo.");
      });
  };

  // Edit a todo
  const editTodo = (todo: any) => {
    console.log("Editing todo:", todo);
    setName(todo.name);
    setDescription(todo.description);
    setEditId(todo.id);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">ToDo List</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {editId === null ? "Add New ToDo" : "Edit ToDo"}
          </h2>
          <input
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            onClick={addTodo}
          >
            {editId === null ? "Add ToDo" : "Save Changes"}
          </button>
          {editId !== null && (
            <button
              className="w-full bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 mt-2"
              onClick={() => {
                setName("");
                setDescription("");
                setEditId(null);
              }}
            >
              Cancel
            </button>
          )}
        </div>

        <ul className="space-y-4">
          {todos.map((todo) => (
            <li key={todo.id} className="bg-white p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800">
                {todo.name}
              </h3>
              <p className="text-gray-600">{todo.description}</p>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
                <button
                  className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600"
                  onClick={() => editTodo(todo)}
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
