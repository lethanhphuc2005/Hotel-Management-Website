const cron = require("node-cron");
const { exec } = require("child_process");
const path = require("path");

// Chạy mỗi đêm lúc 2 giờ sáng
cron.schedule("0 2 * * *", () => {
  const scriptPath = path.resolve(__dirname, "../ai/cluster_keywords.py");
  console.log("Đang chạy script AI clustering...");
  exec(`python "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error("Lỗi khi chạy script AI:", error);
      return;
    }
    if (stderr) console.error("stderr:", stderr);
    console.log("stdout:", stdout);
  });
});
