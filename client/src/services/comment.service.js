import api from './api';

const getComments = async (cardId) => {
  const response = await api.get(`/cards/${cardId}/comments`);
  return response.data;
};

const createComment = async (cardId, commentData) => {
  const response = await api.post(`/cards/${cardId}/comments`, commentData);
  return response.data;
};

const deleteComment = async (id) => {
  const response = await api.delete(`/comments/${id}`);
  return response.data;
};

const commentService = {
  getComments,
  createComment,
  deleteComment,
};

export default commentService;
