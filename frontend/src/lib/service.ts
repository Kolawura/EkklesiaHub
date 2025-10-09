import { api } from "./api";

export const postRequest = async (url: string, body: object) => {
  try {
    const response = await api.post(url, body);
    const data = response.data;

    if (!data.success) {
      const message = data?.message || "An error occurred!";
      return { error: true, status: response.status, message };
    }

    return data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Network error. Please try again.";
    return { error: true, message };
  }
};

export const getRequest = async (url: string) => {
  try {
    const response = await api.get(url);
    const data = response.data;

    if (!data.success) {
      const message = data?.message || "An error occurred!";
      return { error: true, message };
    }

    return data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Network error. Please try again.";
    return { error: true, message };
  }
};
