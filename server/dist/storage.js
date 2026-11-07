"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
// Use MongoDB Atlas storage
const mongo_storage_1 = require("./mongo-storage");
exports.storage = new mongo_storage_1.MongoStorage();
