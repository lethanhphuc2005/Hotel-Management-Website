const parseJSONFields = (body, fields) => {
  for (const field of fields) {
    if (typeof body[field] === "string") {
      try {
        body[field] = JSON.parse(body[field]);
      } catch (e) {
        // Nếu lỗi parse thì bỏ qua
      }
    }
  }
};

module.exports = parseJSONFields;
