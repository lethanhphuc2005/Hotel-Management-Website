import {
  getSuggestions as getSuggestionsFromApi,
  getSuggestionsByKeyword as getSuggestionsByKeywordFromApi,
  addSearchLog as addSearchLogToApi,
  getSearchLogsByUser as getSearchLogsByUserFromApi,
  getSearchTrending as getSearchTrendingFromApi,
  getSearchLogsForAI as getSearchLogsForAIFromApi,
  getSearchLogsByAI as getSearchLogsByAIFromApi,
} from "@/api/searchApi";
import { SuggestionResponse } from "@/types/suggestion";

export const fetchSuggestions = async (
  query: string
): Promise<SuggestionResponse[]> => {
  try {
    const response = await getSuggestionsFromApi(query);

    return response.data;
  } catch (error: any) {
    return [];
  }
};

export const fetchSuggestionsByKeyword = async (
  type: string = "keyword",
  query: string
): Promise<any> => {
  try {
    const response = await getSuggestionsByKeywordFromApi(type, query);
    const data = response.data;
    return {
      roomClasses: data.roomClasses || [],
      features: data.features || [],
      services: data.services || [],
    }
  } catch (error: any) {
    console.error("Error fetching suggestions by keyword:", error);
    return [];
  }
};

export const createSearchLog = async (
  keyword: string,
  type: string
): Promise<void> => {
  try {
    await addSearchLogToApi(keyword, type);
  } catch (error: any) {
    console.error("Error adding search log:", error);
  }
};

export const fetchSearchLogsByUser = async (): Promise<any[]> => {
  try {
    const response = await getSearchLogsByUserFromApi();
    return response.data;
  } catch (error: any) {
    console.error("Error fetching search logs by user:", error);
    return [];
  }
};
export const fetchSearchTrending = async (): Promise<any[]> => {
  try {
    const response = await getSearchTrendingFromApi();
    return response.data;
  } catch (error: any) {
    console.error("Error fetching search trending:", error);
    return [];
  }
};

export const fetchSearchLogsForAI = async (): Promise<any[]> => {
  try {
    const response = await getSearchLogsForAIFromApi();
    return response.data;
  } catch (error: any) {
    console.error("Error fetching search logs for AI:", error);
    return [];
  }
};

export const fetchSearchLogsByAI = async (): Promise<any[]> => {
  try {
    const response = await getSearchLogsByAIFromApi();
    return response.data;
  } catch (error: any) {
    console.error("Error fetching search logs by AI:", error);
    return [];
  }
};
