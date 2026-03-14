import React, { useState, useEffect } from 'react';
import { X, AlignLeft, MessageSquare, Tag, Users, Clock, Paperclip } from 'lucide-react';
import cardService from '../../services/card.service';
import commentService from '../../services/comment.service';
import useSocket from '../../hooks/useSocket';
import useAuth from '../../hooks/useAuth';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { formatTimeAgo, formatDueDate } from '../../utils/formatDate';

const CardModal = ({ cardId, isOpen, onClose, boardId }) => {
  const [card, setCard] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [commentText, setCommentText] = useState('');
  const [description, setDescription] = useState('');
  const [isEditingDesc, setIsEditingDesc] = useState(false);

  const socket = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (!isOpen || !cardId) return;

    const fetchCardDetails = async () => {
      setLoading(true);
      try {
        const cRes = await cardService.getCard(cardId);
        setCard(cRes.data);
        setDescription(cRes.data.description || '');

        const commRes = await commentService.getComments(cardId);
        setComments(commRes.data || []);
      } catch (error) {
        console.error('Failed to load card details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCardDetails();

    if (socket) {
      const handleComment = (newComment) => {
        if (newComment.cardId === cardId) {
          setComments((prev) => [newComment, ...prev]);
        }
      };
      socket.on('commentAdded', handleComment);
      socket.on('cardUpdated', (updatedCard) => {
        if (updatedCard._id === cardId) setCard(updatedCard);
      });

      return () => {
        socket.off('commentAdded', handleComment);
        socket.off('cardUpdated');
      };
    }
  }, [isOpen, cardId, socket]);

  if (!isOpen) return null;

  const handleUpdateDescription = async () => {
    try {
      const res = await cardService.updateCard(cardId, { description });
      setCard(res.data);
      setIsEditingDesc(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await commentService.createComment(cardId, { text: commentText });
      // Socket handles UI update or we do it if no socket
      if (!socket) {
        setComments([res.data, ...comments]);
      }
      setCommentText('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start pt-10 px-4 sm:px-0 bg-black/50 backdrop-blur-sm overflow-y-auto w-full">
      <div className="bg-slate-50 rounded-xl shadow-2xl w-full max-w-3xl mb-10 overflow-hidden flex flex-col relative border border-slate-200">
        
        {/* Header */}
        <div className="bg-white px-6 py-4 flex items-start justify-between border-b border-slate-200 sticky top-0 z-10">
          <div className="flex items-center space-x-3 w-full pr-8">
            <h2 className="text-xl font-bold text-slate-800 break-words w-full">
              {loading ? <div className="h-6 bg-slate-200 rounded animate-pulse w-1/3"></div> : card?.title}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full transition-colors absolute top-4 right-4"
          >
            <X size={24} />
          </button>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center"><Spinner size="lg" /></div>
        ) : (
          <div className="flex flex-col md:flex-row h-full">
            {/* Main Content (Left) */}
            <div className="flex-1 p-6 space-y-8">
              
              {/* Labels & Due Date Row */}
              <div className="flex flex-wrap gap-4 items-center">
                {card?.labels?.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Labels</h3>
                    <div className="flex flex-wrap gap-2">
                      {card.labels.map((l, i) => (
                        <span key={i} className={`inline-block px-3 py-1 rounded-md text-sm font-medium`} style={{ backgroundColor: l.color, color: '#fff' }}>
                          {l.text}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {card?.dueDate && (
                  <div>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Due Date</h3>
                    <div className="bg-white border border-slate-200 px-3 py-1 rounded-md text-sm text-slate-700 flex items-center">
                      <Clock size={14} className="mr-1.5 text-red-500" />
                      {formatDueDate(card.dueDate)}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <AlignLeft size={20} className="text-slate-500" />
                  <h3 className="text-lg font-semibold text-slate-800">Description</h3>
                  {!isEditingDesc && (
                    <button 
                      onClick={() => setIsEditingDesc(true)}
                      className="text-sm bg-slate-200 hover:bg-slate-300 px-3 py-1 rounded text-slate-700 transition-colors ml-2"
                    >
                      Edit
                    </button>
                  )}
                </div>
                
                {isEditingDesc ? (
                  <div className="space-y-3">
                    <textarea
                      className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-y min-h-[120px]"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add a more detailed description..."
                      autoFocus
                    />
                    <div className="flex items-center space-x-2">
                      <Button onClick={handleUpdateDescription}>Save</Button>
                      <button onClick={() => setIsEditingDesc(false)} className="text-slate-500 hover:text-slate-700 font-medium text-sm">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => setIsEditingDesc(true)}
                    className={`cursor-pointer text-sm ${card?.description ? 'text-slate-700' : 'bg-slate-200/50 hover:bg-slate-200 p-4 rounded-lg text-slate-500 transition-colors'}`}
                  >
                    {card?.description ? (
                      <p className="whitespace-pre-wrap">{card.description}</p>
                    ) : (
                      "Add a more detailed description..."
                    )}
                  </div>
                )}
              </div>

              {/* Comments Section */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <MessageSquare size={20} className="text-slate-500" />
                  <h3 className="text-lg font-semibold text-slate-800">Activity</h3>
                </div>

                <div className="flex space-x-3 mb-6">
                  <Avatar user={user} className="mt-1" />
                  <div className="flex-1 bg-white border border-slate-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-primary-500 overflow-hidden">
                    <textarea
                      className="w-full p-3 text-sm outline-none resize-y min-h-[80px]"
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <div className="bg-slate-50 border-t border-slate-200 px-3 py-2 flex justify-end">
                      <Button onClick={handleAddComment} size="sm" disabled={!commentText.trim()}>Save</Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment._id} className="flex space-x-3">
                      <Avatar user={comment.userId} />
                      <div className="flex-1">
                        <div className="flex items-baseline space-x-2">
                          <span className="font-semibold text-slate-800 text-sm">{comment.userId.name}</span>
                          <span className="text-xs text-slate-500">{formatTimeAgo(comment.createdAt)}</span>
                        </div>
                        <div className="bg-white border border-slate-200 px-4 py-2 mt-1 rounded-lg text-sm text-slate-700 shadow-sm inline-block">
                          {comment.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Sidebar (Right) */}
            <div className="w-full md:w-48 bg-slate-100 p-6 border-t md:border-t-0 md:border-l border-slate-200 space-y-6 flex-shrink-0">
              
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Members</h4>
                <div className="flex flex-wrap gap-2">
                  {card?.members?.map((m) => (
                    <Avatar key={m._id} user={m} />
                  ))}
                  <button className="h-8 w-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Add to card</h4>
                <div className="space-y-2">
                  <button className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 py-1.5 px-3 rounded text-sm font-medium flex items-center transition-colors">
                    <Users size={16} className="mr-2" /> Members
                  </button>
                  <button className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 py-1.5 px-3 rounded text-sm font-medium flex items-center transition-colors">
                    <Tag size={16} className="mr-2" /> Labels
                  </button>
                  <button className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 py-1.5 px-3 rounded text-sm font-medium flex items-center transition-colors">
                    <Clock size={16} className="mr-2" /> Dates
                  </button>
                  <button className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 py-1.5 px-3 rounded text-sm font-medium flex items-center transition-colors">
                    <Paperclip size={16} className="mr-2" /> Attachment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardModal;
