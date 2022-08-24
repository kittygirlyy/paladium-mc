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
const axios_1 = __importDefault(require("axios"));
class AuthenticationHandler {
    constructor(clientID, redirectUri) {
        if (!clientID) {
            throw new Error('clientID is required');
        }
        this.clientId = clientID;
        if (!redirectUri) {
            throw new Error('redirectUri is required');
        }
        this.redirectUri = redirectUri;
    }
    get forwardUrl() {
        return `https://login.live.com/oauth20_authorize.srf?client_id=${this.clientId}&response_type=code&redirect_uri=${this.redirectUri}&response_mode=fragment&scope=XboxLive.signin%20offline_access&cobrandid=8058f65d-ce06-4c30-9559-473c9275a65d`;
    }
    getAuthCodes(code, refresh = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!code) {
                throw Error('No Code provided.');
            }
            const authToken = yield this.authCodeToAuthToken(code, refresh);
            const xbl = yield this.authTokenToXBL(authToken);
            const xsts = yield this.xblToXsts(xbl);
            const mcToken = yield this.xstsToMc(xsts);
            const mcInfo = yield this.getMCInfo(mcToken);
            return {
                auth_token: authToken,
                mc_info: mcInfo,
                mc_token: mcToken,
                xbox_token: xbl,
                xsts_token: xsts,
            };
        });
    }
    getMCInfoWithToken(mc_token) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield (0, axios_1.default)({
                url: 'https://api.minecraftservices.com/minecraft/profile',
                method: 'get',
                headers: {
                    Authorization: 'Bearer ' + mc_token,
                },
            })).data;
        });
    }
    authCodeToAuthToken(code, refresh) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = 'client_id=' + this.clientId + '&redirect_uri=' + this.redirectUri;
            if (refresh) {
                data += '&refresh_token=' + code + '&grant_type=refresh_token';
            }
            else {
                data += '&code=' + code + '&grant_type=authorization_code';
            }
            return (yield (0, axios_1.default)({
                url: 'https://login.live.com/oauth20_token.srf',
                method: 'post',
                data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })).data;
        });
    }
    authTokenToXBL(authToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = `{
			"Properties": {
				"AuthMethod": "RPS",
				"SiteName": "user.auth.xboxlive.com",
				"RpsTicket": "d=${authToken.access_token}"
			},
			"RelyingParty": "http://auth.xboxlive.com",
			"TokenType": "JWT"
 		}`;
            return (yield (0, axios_1.default)({
                url: 'https://user.auth.xboxlive.com/user/authenticate',
                method: 'post',
                data,
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })).data;
        });
    }
    xblToXsts(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = `{
			"Properties": {
				"SandboxId": "RETAIL",
				"UserTokens": [
						"${token.Token}"
				]
			},
			"RelyingParty": "rp://api.minecraftservices.com/",
			"TokenType": "JWT"
		}`;
            return (yield (0, axios_1.default)({
                url: 'https://xsts.auth.xboxlive.com/xsts/authorize',
                method: 'post',
                data,
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })).data;
        });
    }
    xstsToMc(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = `{
			"identityToken": "XBL3.0 x=${token.DisplayClaims.xui[0].uhs};${token.Token}"
	 		}`;
            return (yield (0, axios_1.default)({
                url: 'https://api.minecraftservices.com/authentication/login_with_xbox',
                method: 'post',
                data,
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })).data;
        });
    }
    getMCInfo(mc_token) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield (0, axios_1.default)({
                url: 'https://api.minecraftservices.com/minecraft/profile',
                method: 'get',
                headers: {
                    Authorization: 'Bearer ' + mc_token.access_token,
                },
            })).data;
        });
    }
}
exports.default = AuthenticationHandler;
