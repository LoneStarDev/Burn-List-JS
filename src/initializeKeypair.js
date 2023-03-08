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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.initializeKeypair = void 0;
var web3 = require("@solana/web3.js");
var fs = require("fs");
var dotenv_1 = require("dotenv");
dotenv_1["default"].config();
function initializeKeypair(connection) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var signer, secret, secretKey, keypairFromSecretKey;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!!process.env.PRIVATE_KEY) return [3 /*break*/, 2];
                    console.log("Creating .env file");
                    signer = web3.Keypair.generate();
                    fs.writeFileSync(".env", "PRIVATE_KEY=[".concat(signer.secretKey.toString(), "]"));
                    return [4 /*yield*/, airdropSolIfNeeded(signer, connection)];
                case 1:
                    _b.sent();
                    return [2 /*return*/, signer];
                case 2:
                    secret = JSON.parse((_a = process.env.PRIVATE_KEY) !== null && _a !== void 0 ? _a : "");
                    secretKey = Uint8Array.from(secret);
                    keypairFromSecretKey = web3.Keypair.fromSecretKey(secretKey);
                    return [4 /*yield*/, airdropSolIfNeeded(keypairFromSecretKey, connection)];
                case 3:
                    _b.sent();
                    return [2 /*return*/, keypairFromSecretKey];
            }
        });
    });
}
exports.initializeKeypair = initializeKeypair;
function airdropSolIfNeeded(signer, connection) {
    return __awaiter(this, void 0, void 0, function () {
        var balance, airdropSignature, latestBlockHash, newBalance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection.getBalance(signer.publicKey)];
                case 1:
                    balance = _a.sent();
                    console.log("Current balance is", balance / web3.LAMPORTS_PER_SOL);
                    if (!(balance < web3.LAMPORTS_PER_SOL)) return [3 /*break*/, 6];
                    console.log("Airdropping 1 SOL...");
                    return [4 /*yield*/, connection.requestAirdrop(signer.publicKey, web3.LAMPORTS_PER_SOL)];
                case 2:
                    airdropSignature = _a.sent();
                    return [4 /*yield*/, connection.getLatestBlockhash()];
                case 3:
                    latestBlockHash = _a.sent();
                    return [4 /*yield*/, connection.confirmTransaction({
                            blockhash: latestBlockHash.blockhash,
                            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                            signature: airdropSignature
                        })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, connection.getBalance(signer.publicKey)];
                case 5:
                    newBalance = _a.sent();
                    console.log("New balance is", newBalance / web3.LAMPORTS_PER_SOL);
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
