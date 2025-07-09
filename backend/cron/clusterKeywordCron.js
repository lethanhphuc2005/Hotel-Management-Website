const cron = require("node-cron");
const { exec } = require("child_process");
const path = require("path");

function runScript() {
  const scriptPath = path.resolve(__dirname, "../ai/cluster_keywords.py");
  console.log("▶️ Đang chạy script AI clustering...");
  exec(`python "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Lỗi khi chạy script AI:", error.message);
      return;
    }
    if (stderr) console.warn("⚠️ stderr:", stderr);
    console.log("✅ stdout:\n", stdout);
  });
}

// 👉 Cron thực sự (2h sáng mỗi ngày)
cron.schedule("0 2 * * *", runScript);

// 👉 Gọi ngay để test
// runScript();

