export interface SuggestionResponse {
  type: "room" | "feature" | "service" | "keyword"; // Thêm type để phân biệt các loại gợi ý
  label: string;
  id?: string; // Thêm id nếu cần để sử dụng trong các thao tác khác
}