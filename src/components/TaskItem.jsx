import React, { useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Swal from "sweetalert2";
import axios from "axios";

const TaskItem = ({ task, fetchTasks }) => {
  const [isMobile, setIsMobile] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task._id,
  });

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const stopPropagation = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  const editTask = async (task) => {
    try {
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
        fetchTasks();
      }
    } catch (error) {
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
        fetchTasks();
      }
    } catch (error) {
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
    gap: "16px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    cursor: isMobile ? "default" : "grab",
    position: "relative",
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(!isMobile && attributes)}
      {...(!isMobile && listeners)}
    >
      {/* Drag Handle - Visible on mobile only */}
      <div
        className="drag-handle"
        style={{
          position: "absolute",
          top: "8px",
          left: "8px",
          color:"blue",
          cursor: "grab",
          touchAction: "none",
          zIndex: 1,
          display: isMobile ? "block" : "none",
        }}
        {...(isMobile && attributes)}
        {...(isMobile && listeners)}
        onClick={stopPropagation}
      >
        ⠿
      </div>

      <div className="flex-1" style={{ marginLeft: isMobile ? "28px" : "0" }}>
        <h3 className="font-semibold text-gray-800 text-lg">{task.title}</h3>
        {task.description && (
          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
        )}
        <p className="text-xs text-gray-500 mt-2">
          <span className="font-medium">Created: </span>
          {new Date(task.timestamp).toLocaleString()}
        </p>
      </div>

      <div className="flex gap-2" style={{ pointerEvents: "auto",marginLeft: isMobile ? "28px" : "0" }}>
        <button
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          onClick={(e) => {
            stopPropagation(e);
            editTask(task);
          }}
        >
          Edit
        </button>
        <button
          className="text-red-600 hover:text-red-700 text-sm font-medium"
          onClick={(e) => {
            stopPropagation(e);
            deleteTask(task._id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;