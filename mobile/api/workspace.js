import apiClient from './client';

const getWorkspaces = async () => {
  const response = await apiClient.get('/workspaces');
  return response.data;
};

const getWorkspace = async (id) => {
  const response = await apiClient.get(`/workspaces/${id}`);
  return response.data;
};

const createWorkspace = async (workspaceData) => {
  const response = await apiClient.post('/workspaces', workspaceData);
  return response.data;
};

const workspaceService = {
  getWorkspaces,
  getWorkspace,
  createWorkspace,
};

export default workspaceService;
