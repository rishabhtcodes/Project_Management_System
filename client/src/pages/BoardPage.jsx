import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, Settings, Users, Filter, X } from 'lucide-react';
import boardService from '../services/board.service';
import listService from '../services/list.service';
import cardService from '../services/card.service';
import useSocket from '../hooks/useSocket';
import BoardColumn from '../components/board/BoardColumn';
import DraggableCard from '../components/board/DraggableCard';
import CardModal from '../components/modals/CardModal';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import Spinner from '../components/ui/Spinner';

const BoardPage = () => {
  const { id } = useParams();
  const socket = useSocket();

  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeId, setActiveId] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');

  const [selectedCardId, setSelectedCardId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchBoardData = useCallback(async () => {
    try {
      const bRes = await boardService.getBoard(id);
      setBoard(bRes.data);

      const lRes = await listService.getLists(id);
      const fetchedLists = lRes.data || [];
      setLists(fetchedLists);

      let allCards = [];
      for (const list of fetchedLists) {
        const cRes = await cardService.getCards(list._id);
        allCards = [...allCards, ...(cRes.data || [])];
      }
      setCards(allCards);
    } catch (error) {
      console.error('Failed to load board data', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBoardData();

    if (socket) {
      socket.emit('joinBoard', id);
      
      socket.on('boardUpdated', fetchBoardData);
      socket.on('cardCreated', fetchBoardData); // Simplified for now, just refetch
      socket.on('cardUpdated', fetchBoardData);
      socket.on('commentAdded', fetchBoardData);

      return () => {
        socket.emit('leaveBoard', id);
        socket.off('boardUpdated');
        socket.off('cardCreated');
        socket.off('cardUpdated');
        socket.off('commentAdded');
      };
    }
  }, [id, socket, fetchBoardData]);

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);

    if (active.data.current?.type === 'List') {
      setActiveItem(active.data.current.list);
    } else if (active.data.current?.type === 'Card') {
      setActiveItem(active.data.current.card);
    }
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const isActiveCard = active.data.current?.type === 'Card';
    const isOverCard = over.data.current?.type === 'Card';
    const isOverList = over.data.current?.type === 'List';

    if (!isActiveCard) return;

    // Card over another card
    if (isActiveCard && isOverCard) {
      setCards((prev) => {
        const activeIndex = prev.findIndex((t) => t._id === activeId);
        const overIndex = prev.findIndex((t) => t._id === overId);
        
        if (prev[activeIndex].listId !== prev[overIndex].listId) {
          // Moving to different list visually
          const newCards = [...prev];
          newCards[activeIndex].listId = newCards[overIndex].listId;
          return arrayMove(newCards, activeIndex, overIndex);
        }

        return arrayMove(prev, activeIndex, overIndex);
      });
    }

    // Card over empty space in list
    if (isActiveCard && isOverList) {
      setCards((prev) => {
        const activeIndex = prev.findIndex((t) => t._id === activeId);
        const newCards = [...prev];
        newCards[activeIndex].listId = overId;
        return arrayMove(newCards, activeIndex, activeIndex); 
      });
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveItem(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const isActiveList = active.data.current?.type === 'List';
    const isActiveCard = active.data.current?.type === 'Card';

    if (isActiveList && activeId !== overId) {
      const activeIndex = lists.findIndex((l) => l._id === activeId);
      const overIndex = lists.findIndex((l) => l._id === overId);
      const newLists = arrayMove(lists, activeIndex, overIndex);
      setLists(newLists);

      // Backend sync
      try {
        const listToUpdate = newLists[overIndex];
        let newPos = 65535;
        if (overIndex === 0) {
          newPos = (newLists[1]?.position || 65535) / 2;
        } else if (overIndex === newLists.length - 1) {
          newPos = newLists[overIndex - 1].position + 65535;
        } else {
          newPos = (newLists[overIndex - 1].position + newLists[overIndex + 1].position) / 2;
        }
        await listService.updateList(listToUpdate._id, { position: newPos });
      } catch (e) {
        console.error("List move failed", e);
        fetchBoardData(); // Revert
      }
    }

    if (isActiveCard) {
      const activeIndex = cards.findIndex((c) => c._id === activeId);
      const overIndex = cards.findIndex((c) => c._id === overId);
      
      const movedCard = cards[activeIndex];
      const targetListId = over.data.current?.type === 'List' ? overId : cards[overIndex]?.listId;

      if (!targetListId) return;

      const sameList = movedCard.listId === targetListId && activeIndex === overIndex;
      if (sameList) return;

      try {
        await cardService.updateCard(activeId, {
          listId: targetListId,
          // Simple position tracking: append to end for cross-list drops, 
          // or ideally calculate proper midway positions. For brevity relying on refetch or basic pos.
        });
        fetchBoardData();
      } catch (e) {
        console.error("Card move failed", e);
        fetchBoardData(); // Revert
      }
    }
  };

  const handleAddList = async (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    try {
      await listService.createList(board._id, { title: newListTitle });
      setNewListTitle('');
      setIsAddingList(false);
      fetchBoardData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddCard = async (listId, title) => {
    try {
      await cardService.createCard(listId, { title });
      fetchBoardData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      await listService.deleteList(listId);
      fetchBoardData();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-10 flex justify-center"><Spinner /></div>;
  if (!board) return <div className="p-10 text-center text-slate-500">Board not found</div>;

  return (
    <div 
      className="h-full flex flex-col relative"
      style={{ backgroundColor: board.background || '#0079bf' }}
    >
      {/* Board Header Overlay */}
      <div className="glass px-8 py-4 flex items-center justify-between z-10 sticky top-0 shadow-premium border-x-0 border-t-0 border-b-white/5 mx-6 mt-6 rounded-[2rem]">
        <div className="flex items-center space-x-6">
          <div className="flex flex-col">
             <h1 className="text-2xl font-black text-white tracking-tighter drop-shadow-lg leading-tight">{board.title}</h1>
             <p className="text-[10px] font-black text-white/60 uppercase tracking-[2px] mt-0.5">Project Board</p>
          </div>
          <button className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10 p-2.5 rounded-xl backdrop-blur-md transition-all border border-white/5">
            <Settings size={18} />
          </button>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center -space-x-3">
            {board.members?.map((m, i) => (
              <Avatar key={i} user={m.user} className="ring-4 ring-[#141417] shadow-xl w-10 h-10" />
            ))}
            <div className="w-10 h-10 rounded-full bg-blue-600 border-4 border-[#141417] flex items-center justify-center text-[10px] font-black text-white cursor-pointer hover:scale-110 transition-transform">
               +
            </div>
          </div>
          <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>
          <button className="flex items-center text-white font-bold bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-2xl text-xs transition-all shadow-lg shadow-blue-500/20">
            <Users size={16} className="mr-2" /> Share
          </button>
          <button className="flex items-center text-white/80 bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all border border-white/5">
            <Filter size={16} className="mr-2" /> Filter
          </button>
        </div>
      </div>

      {/* Board Canvas */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 scrollbar-thin">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex h-full items-start gap-4">
            <SortableContext items={lists.map(l => l._id)} strategy={horizontalListSortingStrategy}>
              {lists.map((list) => (
                <BoardColumn
                  key={list._id}
                  list={list}
                  cards={cards.filter(c => c.listId === list._id)}
                  onAddCard={handleAddCard}
                  onCardClick={(card) => setSelectedCardId(card._id)}
                  onDeleteList={handleDeleteList}
                />
              ))}
            </SortableContext>

            {/* Add New List Button */}
            <div className="w-72 shrink-0">
              {isAddingList ? (
                <form onSubmit={handleAddList} className="bg-white rounded-xl shadow-md p-3 border border-slate-200">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Enter list title..."
                    className="w-full text-sm font-medium px-3 py-2 border-2 border-primary-500 rounded-md outline-none mb-3"
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                  />
                  <div className="flex items-center space-x-2">
                    <Button type="submit" size="sm">Add list</Button>
                    <button type="button" onClick={() => setIsAddingList(false)} className="text-slate-500 hover:text-slate-800 p-1">
                      <X size={20} />
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setIsAddingList(true)}
                  className="flex items-center text-white/90 bg-white/20 hover:bg-white/30 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors shadow-sm ring-1 ring-white/10"
                >
                  <Plus size={20} className="mr-2" />
                  Add another list
                </button>
              )}
            </div>
            {/* Spacer for right padding */}
            <div className="w-4 shrink-0" />
          </div>
          
          <DragOverlay 
            dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }),
            }}
          >
            {activeId ? (
              activeItem?.type === 'List' ? (
                <div className="w-72 bg-slate-100 rounded-xl px-4 py-3 shadow-2xl ring-2 ring-primary-500 rotate-2 opacity-90">
                  <h3 className="font-semibold text-slate-800 text-sm opacity-50">{activeItem.title}</h3>
                </div>
              ) : (
                <DraggableCard card={activeItem} onClick={() => {}} />
              )
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
      <CardModal 
        cardId={selectedCardId} 
        isOpen={!!selectedCardId} 
        onClose={() => setSelectedCardId(null)} 
        boardId={board._id} 
      />
    </div>
  );
};

export default BoardPage;
