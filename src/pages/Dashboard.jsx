import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import TaskItem from "../components/TaskItem";
import { useAuth } from "../context/AuthContext";
import DroppableColumn from "../components/DroppableColumn";
import Swal from "sweetalert2";

// Connect to Socket.io server
const socket = io("http://localhost:5000");

const Dashboard = () => {
  const { user } = useAuth();
  const [columns, setColumns] = useState({
    "To-Do": [],
    "In Progress": [],
    "Done": [],
  });

  // Fetch tasks from backend
  const fetchTasks = async () => {
    if (!user?.uid) return;
    try {
      const response = await axios.get(`http://localhost:5000/tasks/${user.uid}`);
      const grouped = {
        "To-Do": [],
        "In Progress": [],
        "Done": [],
      };
      response.data.forEach((task) => {
        if (grouped[task.category]) {
          grouped[task.category].push(task);
        }
      });
      setColumns(grouped);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      Swal.fire("Error", "Failed to fetch tasks", "error");
    }
  };

  // Handle real-time task updates
  useEffect(() => {
    if (!user) return;

    socket.on("taskCreated", (newTask) => {
      if (newTask.uid === user.uid) {
        setColumns((prev) => ({
          ...prev,
          [newTask.category]: [...prev[newTask.category], newTask].sort((a, b) => a.order - b.order),
        }));
      }
    });

    socket.on("taskUpdated", ({ id, updates }) => {
      setColumns((prev) => {
        const updatedColumns = { ...prev };
        Object.keys(updatedColumns).forEach((category) => {
          updatedColumns[category] = updatedColumns[category].map((task) =>
            task._id === id ? { ...task, ...updates } : task
          );
        });
        return updatedColumns;
      });
    });

    socket.on("taskDeleted", ({ id }) => {
      setColumns((prev) => {
        const updatedColumns = { ...prev };
        Object.keys(updatedColumns).forEach((category) => {
          updatedColumns[category] = updatedColumns[category].filter((task) => task._id !== id);
        });
        return updatedColumns;
      });
    });

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, [user]);

  // Fetch tasks when user logs in
  useEffect(() => {
    fetchTasks();
  }, [user]);

  // Helper to find the container (column) where a task is located
  const findContainer = (id) => {
    return Object.keys(columns).find((key) => columns[key].some((task) => task._id === id));
  };

  // Handle drag and drop events
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = columns.hasOwnProperty(over.id) ? over.id : findContainer(over.id);

    if (!activeContainer || !overContainer) {
      console.error("Container not found for active or over item", { activeContainer, overContainer });
      return;
    }

    if (activeContainer === overContainer) {
      // Reorder within the same column
      setColumns((prev) => {
        const oldIndex = prev[activeContainer].findIndex((task) => task._id === active.id);
        const newIndex = prev[activeContainer].findIndex((task) => task._id === over.id);
        const newItems = arrayMove(prev[activeContainer], oldIndex, newIndex);
        return { ...prev, [activeContainer]: newItems };
      });
    } else {
      // Move task between different columns
      setColumns((prev) => {
        const sourceItems = [...prev[activeContainer]];
        const destinationItems = [...prev[overContainer]];
        const activeIndex = sourceItems.findIndex((task) => task._id === active.id);
        const [movedTask] = sourceItems.splice(activeIndex, 1);
        movedTask.category = overContainer;

        destinationItems.unshift(movedTask);

        return {
          ...prev,
          [activeContainer]: sourceItems,
          [overContainer]: destinationItems,
        };
      });

      // Update category in backend
      axios
        .put(`http://localhost:5000/tasks/${active.id}`, { category: overContainer })
        .catch((err) => console.error("Error updating task category:", err));
    }
  };

  // Create a new task
  const createTask = async () => {
    try {
      const { value: formValues } = await Swal.fire({
        title: "Create Task",
        html:
          '<input id="swal-input1" class="swal2-input" placeholder="Title">' +
          '<input id="swal-input2" class="swal2-input" placeholder="Description">',
        focusConfirm: false,
        preConfirm: () => {
          return {
            title: document.getElementById("swal-input1").value,
            description: document.getElementById("swal-input2").value,
          };
        },
      });

      if (formValues) {
        await axios.post("http://localhost:5000/tasks", {
          ...formValues,
          category: "To-Do",
          uid: user.uid,
          order: Date.now(),
        });
        Swal.fire("Success", "Task created", "success");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      Swal.fire("Error", "Failed to create task", "error");
    }
  };

  return (
    <div className="flex flex-col p-4 space-y-4">
      <h1 className="text-3xl font-bold text-center">Task Manager Dashboard</h1>
      <button className="btn btn-primary my-4" onClick={createTask}>
        Create Task
      </button>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex flex-col md:flex-row gap-4">
          {Object.keys(columns).map((category) => (
            <DroppableColumn key={category} id={category}>
              <h2 className="text-xl text-green-400 font-bold mb-2">{category}</h2>
              <SortableContext items={columns[category].map((task) => task._id)} strategy={verticalListSortingStrategy}>
                {columns[category].map((task) => (
                  <TaskItem key={task._id} task={task} />
                ))}
              </SortableContext>
            </DroppableColumn>
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default Dashboard;
