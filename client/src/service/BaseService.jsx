import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

async function callApi(method, url, data = null) {
  try {
    const response = await api[method](url, data);
    return {
      status: response.status,
      data: response.data,
      headers: response.headers,
    };
  } catch (error) {
    return {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers,
    };
  }
}

export async function getAPI(url) {
  return callApi("get", url);
}

export async function postAPI(url, data) {
  return callApi("post", url, data);
}

export async function putAPI(url, data) {
  return callApi("put", url, data);
}

export async function deleteAPI(url) {
  return callApi("delete", url);
}

export async function patchAPI(url, data) {
  return callApi("patch", url, data);
}
