const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const PROMPT = `
  Tôi muốn đặt phòng cho 2 người lớn, 1 trẻ em từ 10/7 đến 12/7. Gợi ý giúp tôi loại phòng phù hợp, có view đẹp, tiện nghi tốt và trong tầm giá khoảng 1 triệu đến 2 triệu một đêm.
  Trả kết quả dưới dạng JSON có room_ids.
  `;

const testModels = ["gemini-2.0-flash", "gemini-2.5-flash"];

async function benchmark(modelName) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: modelName });

  const start = Date.now();
  const result = await model.generateContent(PROMPT);
  const duration = Date.now() - start;

  const output = result.response.text();

  return {
    model: modelName,
    durationMs: duration,
    output,
  };
}

async function run() {
  for (const modelName of testModels) {
    try {
      console.log(`\n🚀 Testing model: ${modelName}`);
      const { durationMs, output } = await benchmark(modelName);
      console.log(`⏱ Duration: ${durationMs}ms`);
      console.log("📤 Response:\n", output.slice(0, 1000), "..."); // in trước 1000 ký tự
    } catch (err) {
      console.error(`❌ Error with ${modelName}:`, err.message);
    }
  }
}

run();
