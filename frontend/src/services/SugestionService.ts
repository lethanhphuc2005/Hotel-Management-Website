import { getSuggestions as getSuggestionsFromApi } from "@/api/suggestionApi";
import { SuggestionResponse } from "@/types/suggestion";

export const getSuggestions = async (
  query: string
): Promise<SuggestionResponse[]> => {
  try {
    const response = await getSuggestionsFromApi(query);

    return response;
  } catch (error: any) {
    return [];
  }
};
