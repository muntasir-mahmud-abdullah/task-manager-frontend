import React from 'react';
import { useDroppable } from '@dnd-kit/core';

const DroppableColumn = ({ id, children }) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className="flex-1 bg-gray-100 p-4 rounded">
      {children}
    </div>
  );
};

export default DroppableColumn;
