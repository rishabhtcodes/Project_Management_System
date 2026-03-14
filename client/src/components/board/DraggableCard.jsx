import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AlignLeft, CheckSquare, MessageSquare, Paperclip, Clock } from 'lucide-react';
import { formatDueDate } from '../../utils/formatDate';
import Badge from '../ui/Badge';

const DraggableCard = ({ card, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card._id,
    data: {
      type: 'Card',
      card,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="bg-primary-50 border-2 border-primary-400 rounded-md p-3 mb-2 opacity-50 h-24"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(card)}
      className="bg-white rounded-md shadow-sm border border-slate-200 p-3 mb-2 cursor-pointer hover:border-primary-400 transition-colors group"
    >
      {/* Labels */}
      {card.labels && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {card.labels.map((label, idx) => (
            <Badge key={idx} color={label.color} className="h-2 w-10 px-0 sm:w-10 rounded-full text-transparent" />
          ))}
        </div>
      )}

      {/* Title */}
      <h4 className="text-sm text-slate-800 break-words font-medium">{card.title}</h4>

      {/* Badges/Icons Row */}
      <div className="flex items-center flex-wrap gap-3 mt-3 text-slate-500 text-xs">
        {card.dueDate && (
          <div className="flex items-center text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
            <Clock size={12} className="mr-1" />
            {formatDueDate(card.dueDate)}
          </div>
        )}
        {card.description && <AlignLeft size={14} />}
        {card.attachments?.length > 0 && (
          <div className="flex items-center">
            <Paperclip size={14} className="mr-1" />
            {card.attachments.length}
          </div>
        )}
        {card.comments?.length > 0 && (
          <div className="flex items-center">
            <MessageSquare size={14} className="mr-1" />
            {card.comments.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default DraggableCard;
