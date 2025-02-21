import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const TaskItem = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task._id,
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '8px',
    margin: '4px 0',
    background: 'white',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <h3 className="font-semibold text-black">{task.title}</h3>
      <p className="text-sm text-black">{task.description}</p>
    </div>
  );
};

export default TaskItem;
