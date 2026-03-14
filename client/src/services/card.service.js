import api from './api';

const getCards = async (listId) => {
  const response = await api.get(`/lists/${listId}/cards`);
  return response.data;
};

const getCard = async (id) => {
  const response = await api.get(`/cards/${id}`);
  return response.data;
};

const createCard = async (listId, cardData) => {
  const response = await api.post(`/lists/${listId}/cards`, cardData);
  return response.data;
};

const updateCard = async (id, cardData) => {
  const response = await api.put(`/cards/${id}`, cardData);
  return response.data;
};

const deleteCard = async (id) => {
  const response = await api.delete(`/cards/${id}`);
  return response.data;
};

const cardService = {
  getCards,
  getCard,
  createCard,
  updateCard,
  deleteCard,
};

export default cardService;
