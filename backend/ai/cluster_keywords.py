import os
import re
from dotenv import load_dotenv
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
import numpy as np
from collections import defaultdict

# === Load biến môi trường ===
load_dotenv()
MONGO_URI = os.getenv("MONGOOSE_URL")

# === Kết nối MongoDB ===
client = MongoClient(MONGO_URI)
db = client["DB_Hotel_V2"]
logs_collection = db["search_log"]
clusters_collection = db["search_cluster"]

# === Chuẩn hóa từ khóa ===
import re
import unicodedata

def normalize(text):
  # 1. Loại bỏ khoảng trắng dư, viết thường
  text = text.strip().lower()
  
  # 2. Bỏ dấu tiếng Việt
  text = unicodedata.normalize("NFD", text)
  text = text.encode("ascii", "ignore").decode("utf-8")
  
  # 3. Xóa ký tự đặc biệt (giữ chữ cái, số và khoảng trắng)
  text = re.sub(r"[^\w\s]", "", text)
  
  # 4. Chuẩn hóa khoảng trắng
  text = re.sub(r"\s+", " ", text)

  return text


# === Lấy danh sách từ khóa tìm kiếm ===
logs = logs_collection.find({}, {"keyword": 1})
keywords = [normalize(log["keyword"]) for log in logs if log.get("keyword")]
keywords = list(set(keywords))  # loại trùng

if not keywords:
    print("Không có dữ liệu từ khóa.")
    exit()

# === Embedding bằng SentenceTransformer ===
print(f"Embedding {len(keywords)} keywords...")
model = SentenceTransformer("all-MiniLM-L6-v2")
embeddings = model.encode(keywords)

# === Phân cụm KMeans ===
n_clusters = min(10, len(keywords))  # ví dụ: chia thành 10 cụm
kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init="auto")
labels = kmeans.fit_predict(embeddings)

# === Gom cụm + chọn từ đại diện ===
cluster_map = defaultdict(list)
for idx, label in enumerate(labels):
    cluster_map[label].append((keywords[idx], embeddings[idx]))

# === Xóa dữ liệu cũ
clusters_collection.delete_many({})

# === Lưu kết quả
for cluster_id, items in cluster_map.items():
    kw_list = [kw for kw, _ in items]
    centroid = np.mean([v for _, v in items], axis=0)
    representative = min(
        items, key=lambda x: np.linalg.norm(x[1] - centroid)
    )[0]

    clusters_collection.insert_one({
        "cluster_id": int(cluster_id),
        "keywords": kw_list,
        "representative": representative,
    })

print(f"Đã lưu {len(cluster_map)} cụm từ khóa.")
