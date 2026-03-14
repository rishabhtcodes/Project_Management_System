import apiClient from './client';

const getBoards = async (workspaceId) => {
  const response = await apiClient.get(`/workspaces/${workspaceId}/boards`);
  return response.data;
};

const getBoard = async (id) => {
  const response = await apiClient.get(`/boards/${id}`);
  return response.data;
};

const createBoard = async (workspaceId, boardData) => {
  const response = await apiClient.post(`/workspaces/${workspaceId}/boards`, boardData);
  return response.data;
};

const boardService = {
  getBoards,
  getBoard,
  createBoard,
};

export default boardService;
