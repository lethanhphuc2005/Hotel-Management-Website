export interface SuggestionResponse {
  type: "room" | "feature" | "service";
  label: string;
  id: string; // Thêm id nếu cần để sử dụng trong các thao tác khác
}