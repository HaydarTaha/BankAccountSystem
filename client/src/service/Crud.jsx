import { postAPI, getAPI, deleteAPI, patchAPI } from "./BaseService";

export async function createData(path, data) {
  return await postAPI(`/api/crud/${path}`, data);
}

export async function getAllData(path) {
  return await getAPI(`/api/crud/${path}`);
}

export async function updateData(path, id, data) {
  return await patchAPI(`/api/crud/${path}/${id}`, data);
}

export async function deleteData(path, id) {
  return await deleteAPI(`/api/crud/${path}/${id}`);
}
