import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal, Plus, X } from 'lucide-react';
import DraggableCard from './DraggableCard';

const BoardColumn = ({ list, cards, onAddCard, onCardClick, onDeleteList }) => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list._id,
    data: {
      type: 'List',
      list,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleAddCardSubmit = (e) => {
    e.preventDefault();
    if (newCardTitle.trim()) {
      onAddCard(list._id, newCardTitle);
      setNewCardTitle('');
      setIsAddingCard(false);
    }
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="w-72 shrink-0 h-full max-h-full rounded-xl bg-slate-200/50 border-2 border-primary-400 opacity-50"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-72 shrink-0 flex flex-col max-h-full bg-slate-100/80 rounded-xl"
    >
      {/* Column Header */}
      <div
        {...attributes}
        {...listeners}
        className="px-4 py-3 pb-2 flex items-center justify-between cursor-grab active:cursor-grabbing"
      >
        <h3 className="font-semibold text-slate-800 text-sm">{list.title}</h3>
        <button 
          className="text-slate-500 hover:text-slate-700 hover:bg-slate-200 p-1.5 rounded-md transition-colors"
          onClick={(e) => {
            e.stopPropagation(); // Prevent drag from triggering
            if (window.confirm('Delete this list?')) {
              onDeleteList(list._id);
            }
          }}
        >
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Cards Scrollable Area */}
      <div className="px-2 flex-1 overflow-y-auto scrollbar-thin flex flex-col gap-2 p-2">
        <SortableContext items={cards.map(c => c._id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <DraggableCard key={card._id} card={card} onClick={onCardClick} />
          ))}
        </SortableContext>

        {isAddingCard ? (
          <form onSubmit={handleAddCardSubmit} className="mt-2 bg-white rounded-md shadow-sm border border-slate-200 p-2">
            <textarea
              autoFocus
              className="w-full text-sm resize-none outline-none text-slate-800"
              placeholder="Enter a title for this card..."
              rows={3}
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  handleAddCardSubmit(e);
                }
              }}
            />
            <div className="flex items-center space-x-2 mt-2">
              <button 
                type="submit" 
                className="bg-primary-600 text-white px-3 py-1.5 rounded text-sm hover:bg-primary-700 font-medium"
              >
                Add card
              </button>
              <button 
                type="button" 
                onClick={() => setIsAddingCard(false)} 
                className="text-slate-500 hover:text-slate-800 p-1"
              >
                <X size={20} />
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingCard(true)}
            className="flex items-center text-slate-600 hover:bg-slate-200 hover:text-slate-800 px-3 py-2 mt-1 rounded-md text-sm font-medium transition-colors w-full"
          >
            <Plus size={16} className="mr-2" />
            Add a card
          </button>
        )}
      </div>
    </div>
  );
};

export default BoardColumn;
