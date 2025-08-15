const { jsonrepair } = require("jsonrepair");

const parseJsonSmart = (text) => {
  if (!text || typeof text !== "string") return null;

  let jsonStr = null;

  // 1️⃣ Ưu tiên tìm trong ```json ... ```
  const blockMatch = text.match(/```json\s*([\s\S]*?)```/i);
  if (blockMatch?.[1]) {
    jsonStr = blockMatch[1].trim();
  }

  // 2️⃣ Nếu không có ```json``` → tìm dấu { hoặc [
  if (!jsonStr) {
    const curlyMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (curlyMatch) {
      jsonStr = curlyMatch[0].trim();
    }
  }

  if (!jsonStr) return null;

  // 3️⃣ Thử parse trực tiếp
  try {
    return JSON.parse(jsonStr);
  } catch {
    // 4️⃣ Sửa lỗi JSON bằng jsonrepair
    try {
      const repaired = jsonrepair(jsonStr);
      return JSON.parse(repaired);
    } catch (err) {
      console.error("❌ parseJsonSmart lỗi:", err.message);
      return null;
    }
  }
};

module.exports = parseJsonSmart;