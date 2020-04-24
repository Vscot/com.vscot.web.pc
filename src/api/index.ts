import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { message } from "antd";

const service = axios.create({
  baseURL: "http://127.0.0.1:7000",
  timeout: 30000,
});

service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return config;
  },
  (error: Error) => {
    message.error(error.message);
  }
);

service.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status) {
    }
    return response;
  },
  (err: Error) => {
    message.error(err.message);
  }
);

export const get = async (url: string, data: any) => {
  const result = await service({ method: "get", url: url, params: data });
  return result;
};

export const post = async (url: string, data: any) => {
  const result = await service({ method: "POST", url: url, data: data });
  return result;
};

export const submitForm = async (url: string, data: any) => {
  const result = await service({
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    url: url,
    data: data,
  });
  return result;
};
