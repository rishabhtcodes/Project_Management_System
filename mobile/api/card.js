import apiClient from './client';

const getCards = async (listId) => {
  const response = await apiClient.get(`/lists/${listId}/cards`);
  return response.data;
};

const getCard = async (id) => {
  const response = await apiClient.get(`/cards/${id}`);
  return response.data;
};

const createCard = async (listId, cardData) => {
  const response = await apiClient.post(`/lists/${listId}/cards`, cardData);
  return response.data;
};

const moveCard = async (id, listId) => {
  const response = await apiClient.put(`/cards/${id}`, { listId });
  return response.data;
};

const cardService = {
  getCards,
  getCard,
  createCard,
  moveCard,
};

export default cardService;
