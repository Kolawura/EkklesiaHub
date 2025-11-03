import axios from "axios";
import { api } from "./api";

function extractErrorMessage(error: unknown): string {
  let message = "Network error. Please try again.";
  if (axios.isAxiosError(error)) {
    message =
      (typeof error.response?.data === "string"
        ? error.response.data
        : (error.response?.data as { message?: string } | undefined)
            ?.message) ||
      error.message ||
      message;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    message = (error as { message?: string }).message || message;
  }
  return message;
}

export const postRequest = async (url: string, body: object) => {
  try {
    const response = await api.post(url, body);
    const data = response.data;
    if (!data.success) {
      const message = data?.message || "An error occurred!";
      throw new Error(message);
    }
    return data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getRequest = async (url: string) => {
  try {
    const response = await api.get(url);
    const data = response.data;
    if (!data.success) {
      const message = data?.message || "An error occurred!";
      throw new Error(message);
    }
    return data;
  } catch (error: unknown) {
    console.log(error);
    throw new Error(extractErrorMessage(error));
  }
};

export const putRequest = async (url: string, body: object) => {
  try {
    const response = await api.put(url, body);
    const data = response.data;
    if (!data.success) {
      const message = data?.message || "An error occurred!";
      throw new Error(message);
    }
    return data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error));
  }
};

export const patchRequest = async (url: string, body: object) => {
  try {
    const response = await api.patch(url, body);
    const data = response.data;
    if (!data.success) {
      const message = data?.message || "An error occurred!";
      throw new Error(message);
    }
    return data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error));
  }
};

export const deleteRequest = async (url: string) => {
  try {
    const response = await api.delete(url);
    const data = response.data;
    if (!data.success) {
      const message = data?.message || "An error occurred!";
      throw new Error(message);
    }
    return data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error));
  }
};
