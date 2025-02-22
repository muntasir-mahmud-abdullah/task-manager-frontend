import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Swal from "sweetalert2";
import axios from "axios";

const TaskItem = ({ task, fetchTasks }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task._id,
    });

  const stopPropagation = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  const editTask = async (task) => {
    try {
      console.log(task);
      const { value: formValues } = await Swal.fire({
        title: "Edit Task",
        html: `
          <input id="swal-input1" class="swal2-input" value="${task.title}" placeholder="Title">
          <input id="swal-input2" class="swal2-input" value="${task.description}" placeholder="Description">
        `,
        focusConfirm: false,
        preConfirm: () => ({
          title: document.getElementById("swal-input1").value,
          description: document.getElementById("swal-input2").value,
        }),
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      if (formValues) {
        await axios.put(
          `https://task-manager-backend-1-vyq6.onrender.com/tasks/${task._id}`,
          formValues
        );
        Swal.fire("Success", "Task updated", "success");
        // Trigger parent refresh
      }
    } catch (error) {
      console.error("Error updating task:", error);
      Swal.fire("Error", "Failed to update task", "error");
    }
  };

  const deleteTask = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This task will be permanently deleted.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(
          `https://task-manager-backend-1-vyq6.onrender.com/tasks/${id}`
        );
        Swal.fire("Deleted!", "Your task has been deleted.", "success");
        fetchTasks(); // Refresh tasks after deletion
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      Swal.fire("Error", "Failed to delete task", "error");
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "16px",
    margin: "8px 0",
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="hover:shadow-md transition-all"
      {...attributes}
      {...listeners}
    >
      {/* Drag Handle */}
      {/* <div
        className="drag-handle text-gray-400 hover:text-gray-600 transition-colors"
        style={{ padding: "8px", userSelect: "none" }}
        onClick={stopPropagation}
      >
        ⠿
      </div> */}

      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 text-lg">{task.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
      </div>

      <div className="flex gap-3" style={{ pointerEvents: "auto" }}>
        <button
          className="btn btn-info btn-sm bg-blue-100 text-blue-600 hover:bg-blue-200 border-0 px-4"
          onClick={(e) => {
            stopPropagation(e);
            editTask(task);
          }}
          onPointerDown={stopPropagation}
          onMouseDown={stopPropagation}
        >
          Edit
        </button>
        <button
          className="btn btn-error btn-sm bg-red-100 text-red-600 hover:bg-red-200 border-0 px-4"
          onClick={(e) => {
            stopPropagation(e);
            deleteTask(task._id);
          }}
          onPointerDown={stopPropagation}
          onMouseDown={stopPropagation}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
