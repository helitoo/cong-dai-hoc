// Nếu file Node hỗ trợ CommonJS
const {
  getMapFromJson,
  getFieldsFromMap,
} = require("D:\\project\\cong-dai-hoc\\lib\\universities\\general-helpers\\json-processing.ts");
const schools = require("D:\\project\\cong-dai-hoc\\lib\\universities\\data\\schools.json");

console.log(getFieldsFromMap(getMapFromJson(schools), "name"));
