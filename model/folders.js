import { request } from "~/assets/utils/axios";

// create folder
export const createFolder = data => {
  return request.post(`/folders`, data);
};

// get all folders
export const getAllFolders = () => {
  return request.get(`/folders/root/folder-items`, {
    limit: 20,
    offset: 1
  });
};

// get files
export const getRootFiles = () => {
  return request.get(`/folders/root/file-items`, {
    limit: 20,
    offset: 1
  });
};

// get folder
export const getFolder = folder_id => {
  return request.get(`/folders/${folder_id}/folder-items`, {
    id: folder_id,
    limit: 20,
    offset: 1
  });
};

// get folder files
export const getFolderFiles = folder_id => {
  return request.get(`/folders/${folder_id}/file-items`, {
    id: folder_id,
    limit: 20,
    offset: 1
  });
};

// get folder parent
export const getFolderParent = (folder_parent, folder_id) => {
  return request.get(`/folders/${folder_parent}`, {
    id: folder_id
  });
};
