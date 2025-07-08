import { publicApi, api } from "@/lib/axiosInstance";

export const getSuggestions = async (q: string) => {
  try {
    const response = await publicApi.get("/suggestion", {
      params: { q },
    });
    return response;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    throw error;
  }
};

export const getSuggestionsByKeyword = async (type: string = "keyword", query: string) => {
  try {
    const response = await publicApi.get("/suggestion/keyword", {
      params: { type, query },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching suggestions by keyword:", error);
    throw error;
  }
}

export const addSearchLog = async (keyword: string, type: string) => {
  try {
    const response = await api.post("/search-log", { keyword, type });
    return response.data;
  } catch (error) {
    console.error("Error adding search log:", error);
    throw error;
  }
};

export const getSearchLogsByUser = async () => {
  try {
    const response = await api.get(`/search-log/history/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching search logs by user:", error);
    throw error;
  }
};

export const getSearchTrending = async () => {
  try {
    const response = await publicApi.get("/search-log/trending");
    return response.data;
  } catch (error) {
    console.error("Error fetching search trending:", error);
    throw error;
  }
};

export const getSearchLogsForAI = async () => {
  try {
    const response = await publicApi.get("/search-log/ai-keywords");
    return response.data;
  } catch (error) {
    console.error("Error fetching search logs for AI:", error);
    throw error;
  }
};

export const getSearchLogsByAI = async () => {
  try {
    const response = await publicApi.get("/search-cluster");
    return response.data;
  } catch (error) {
    console.error("Error fetching search logs by AI:", error);
    throw error;
  }
};
