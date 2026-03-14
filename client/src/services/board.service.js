import api from './api';

const getBoards = async (workspaceId) => {
  const response = await api.get(`/workspaces/${workspaceId}/boards`);
  return response.data;
};

const getBoard = async (id) => {
  const response = await api.get(`/boards/${id}`);
  return response.data;
};

const createBoard = async (workspaceId, boardData) => {
  const response = await api.post(`/workspaces/${workspaceId}/boards`, boardData);
  return response.data;
};

const updateBoard = async (id, boardData) => {
  const response = await api.put(`/boards/${id}`, boardData);
  return response.data;
};

const deleteBoard = async (id) => {
  const response = await api.delete(`/boards/${id}`);
  return response.data;
};

const boardService = {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
};

export default boardService;
