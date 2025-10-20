import { api } from "./api";
import { getRequest, postRequest } from "./service";
import { RegisterType, LoginType } from "./type";

export const registerUser = async (data: RegisterType) => {
  const res = await postRequest("/auth/register", data);
  return res;
};

export const loginUser = async (data: LoginType) => {
  const res = await postRequest("/auth/login", data);
  return res;
};

export const logoutUser = async () => {
  const res = await postRequest("/auth/logout", {});
  return res;
};

export const getCurrentUser = async () => {
  const res = await getRequest("/auth/me");
  return res;
};
