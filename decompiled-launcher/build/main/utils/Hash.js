"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHexHashCrc32 = exports.getHexHash = void 0;
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const crc32_1 = require("@aws-crypto/crc32");
function getHexHash(filePath) {
    const fileBuffer = fs_1.default.readFileSync(filePath);
    const hashSum = crypto_1.default.createHash('sha1');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
}
exports.getHexHash = getHexHash;
function getHexHashCrc32(filePath) {
    const fileBuffer = fs_1.default.readFileSync(filePath);
    const resultHash = (new crc32_1.Crc32).update(fileBuffer).digest().toString(16);
    return resultHash.length === 8 ? resultHash : `0${resultHash}`;
}
exports.getHexHashCrc32 = getHexHashCrc32;
