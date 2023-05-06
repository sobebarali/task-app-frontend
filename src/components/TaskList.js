import React, { useState } from "react";
import "./TaskList.css";

const PAGE_SIZE = 5;

const TaskList = ({ tasks, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const deleteTask = (taskId) => {
    onDelete(taskId);
    const newTotalPages = Math.ceil((tasks.length - 1) / PAGE_SIZE);
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  };

  const paginatedTasks = tasks.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const totalPages = Math.ceil(tasks.length / PAGE_SIZE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="task-list-container">
      <ul className="task-list">
        {paginatedTasks.map((task) => (
          <li key={task._id} className="task-item">
            <span className="task-title">{task.title}</span>
            <button
              className="delete-button"
              onClick={() => deleteTask(task._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <div className="pagination">
          {[...Array(totalPages).keys()].map((page) => (
            <button
              key={page + 1}
              className={currentPage === page + 1 ? "active" : ""}
              onClick={() => handlePageChange(page + 1)}
            >
              {page + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
