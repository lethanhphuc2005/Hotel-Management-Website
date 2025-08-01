import { publicApi, api } from "@/lib/axiosInstance";

export const getSuggestions = async (q: string) => {
  const response = await publicApi.get("/suggestion", {
    params: { q },
  });
  return response;
};

export const getSuggestionsByKeyword = async (
  type: string = "keyword",
  query: string
) => {
  const response = await publicApi.get("/suggestion/keyword", {
    params: { type, query },
  });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data;
};

export const addSearchLog = async (keyword: string, type: string) => {
  const response = await api.post("/search-log", { keyword, type });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data;
};

export const getSearchLogsByUser = async () => {
  const response = await api.get(`/search-log/history/`);
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data;
};

export const getSearchTrending = async () => {
  const response = await publicApi.get("/search-log/trending");
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data;
};

export const getSearchLogsForAI = async () => {
  const response = await publicApi.get("/search-log/ai-keywords");
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data;
};

export const getSearchLogsByAI = async () => {
  const response = await publicApi.get("/search-cluster");
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.data;
};
