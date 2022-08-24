"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const content_api_1 = __importDefault(require("@tryghost/content-api"));
const ghostApi = new content_api_1.default({
    url: 'https://ghost.paladium-pvp.fr',
    key: 'cc25825386fcf87df32f7fc535',
    version: 'v3'
});
electron_1.ipcMain.handle('getBlogPosts', () => __awaiter(void 0, void 0, void 0, function* () {
    return null;
}));
