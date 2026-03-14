import api from './api';

const getWorkspaces = async () => {
  const response = await api.get('/workspaces');
  return response.data;
};

const getWorkspace = async (id) => {
  const response = await api.get(`/workspaces/${id}`);
  return response.data;
};

const createWorkspace = async (workspaceData) => {
  const response = await api.post('/workspaces', workspaceData);
  return response.data;
};

const updateWorkspace = async (id, workspaceData) => {
  const response = await api.put(`/workspaces/${id}`, workspaceData);
  return response.data;
};

const deleteWorkspace = async (id) => {
  const response = await api.delete(`/workspaces/${id}`);
  return response.data;
};

const inviteMember = async (id, email) => {
  const response = await api.post(`/workspaces/${id}/members`, { email });
  return response.data;
};

const workspaceService = {
  getWorkspaces,
  getWorkspace,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  inviteMember,
};

export default workspaceService;
