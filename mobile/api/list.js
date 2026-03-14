import apiClient from './client';

const getLists = async (boardId) => {
  const response = await apiClient.get(`/boards/${boardId}/lists`);
  return response.data;
};

const createList = async (boardId, listData) => {
  const response = await apiClient.post(`/boards/${boardId}/lists`, listData);
  return response.data;
};

const listService = {
  getLists,
  createList,
};

export default listService;
