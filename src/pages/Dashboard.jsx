import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import TaskItem from '../components/TaskItem';
import { useAuth } from '../context/AuthContext';
import DroppableColumn from '../components/DroppableColumn';

const Dashboard = () => {
  const { user } = useAuth();
  const [columns, setColumns] = useState({
    'To-Do': [],
    'In Progress': [],
    'Done': [],
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/tasks/${user.uid}`);
        const grouped = {
          'To-Do': [],
          'In Progress': [],
          'Done': [],
        };
        response.data.forEach(task => {
          if (grouped[task.category]) {
            grouped[task.category].push(task);
          }
        });
        setColumns(grouped);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    if (user) fetchTasks();
  }, [user]);

  // Helper to find container by task id (for same-column reordering)
  const findContainer = (id) => {
    return Object.keys(columns).find(key => columns[key].some(task => task._id === id));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
  
    // Determine the container for the active item.
    const activeContainer = findContainer(active.id);
    // If over.id is not a container key, find the container from the task id.
    const overContainer = columns.hasOwnProperty(over.id) ? over.id : findContainer(over.id);
  
    if (!activeContainer || !overContainer) {
      console.error("Container not found for active or over item", { activeContainer, overContainer });
      return;
    }
  
    console.log("Active container:", activeContainer);
    console.log("Over container:", overContainer);
  
    if (activeContainer === overContainer) {
      // Reorder within the same container
      setColumns(prev => {
        const oldIndex = prev[activeContainer].findIndex(task => task._id === active.id);
        const newIndex = prev[activeContainer].findIndex(task => task._id === over.id);
        const newItems = arrayMove(prev[activeContainer], oldIndex, newIndex);
        return { ...prev, [activeContainer]: newItems };
      });
    } else {
      // Move task between containers
      setColumns(prev => {
        const sourceItems = [...prev[activeContainer]];
        const destinationItems = [...prev[overContainer]];
        const activeIndex = sourceItems.findIndex(task => task._id === active.id);
        const [movedTask] = sourceItems.splice(activeIndex, 1);
        movedTask.category = overContainer; // update the category
  
        // Insert the moved task into the destination column.
        destinationItems.unshift(movedTask);
  
        return {
          ...prev,
          [activeContainer]: sourceItems,
          [overContainer]: destinationItems,
        };
      });
  
      // Optionally update the backend:
      axios.put(`http://localhost:5000/tasks/${active.id}`, { category: overContainer })
        .catch(err => console.error('Error updating task category:', err));
    }
  };
  

  return (
    <div className="flex flex-col p-4 space-y-4">
      <h1 className="text-3xl font-bold text-center">Task Manager Dashboard</h1>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex flex-col md:flex-row gap-4">
        {Object.keys(columns).map(category => (
  <DroppableColumn key={category} id={category}>
              <h2 className="text-xl text-green-400 font-bold mb-2">{category}</h2>
              <SortableContext items={columns[category].map(task => task._id)} strategy={verticalListSortingStrategy}>
                {columns[category].map(task => (
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
