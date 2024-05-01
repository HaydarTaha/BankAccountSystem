import { postAPI, deleteAPI } from "./BaseService";

export async function Login(data) {
  const url = "/api/users/login";
  const apiData = {
    email: data.email,
    password: data.password,
  };
  return await postAPI(url, apiData);
}

export async function Register(data) {
  const url = "/api/users/register";
  const apiData = {
    name: data.name,
    surname: data.surname,
    email: data.email,
    password: data.password,
  };
  return await postAPI(url, apiData);
}

export async function Logout() {
  const url = "/api/users/logout";
  return await deleteAPI(url);
}
