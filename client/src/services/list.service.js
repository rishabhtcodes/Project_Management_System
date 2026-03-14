import api from './api';

const getLists = async (boardId) => {
  const response = await api.get(`/boards/${boardId}/lists`);
  return response.data;
};

const createList = async (boardId, listData) => {
  const response = await api.post(`/boards/${boardId}/lists`, listData);
  return response.data;
};

const updateList = async (id, listData) => {
  const response = await api.put(`/lists/${id}`, listData);
  return response.data;
};

const deleteList = async (id) => {
  const response = await api.delete(`/lists/${id}`);
  return response.data;
};

const listService = {
  getLists,
  createList,
  updateList,
  deleteList,
};

export default listService;
