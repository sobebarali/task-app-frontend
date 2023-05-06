import React, { useState, useEffect } from "react";
import "./TaskApp.css";
import axiosInstance from "../axiosConfig";
import AddTask from "../components/AddTask";
import TaskList from "../components/TaskList";

const TaskApp = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get("/task/list");
      setTasks(response.data.todos);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (title) => {
    try {
      const response = await axiosInstance.post("/task/create", { title });
      const newTask = response.data.data.todo;
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axiosInstance.delete(`/task/${id}`);
      const updatedTasks = tasks.filter((task) => task._id !== id);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="task-app">
      <h1>Task Manager</h1>
      <AddTask onAdd={addTask} />
      <TaskList tasks={tasks} onDelete={deleteTask} />
    </div>
  );
};

export default TaskApp;
