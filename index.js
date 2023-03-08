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
var js_1 = require("@metaplex-foundation/js");
var web3_js_1 = require("@solana/web3.js");
var spl_token_1 = require("@solana/spl-token");
var dist_1 = require("@supercharge/promise-pool/dist");
function nft_Array_Sort() {
    return __awaiter(this, void 0, void 0, function () {
        var connection, metaplex, wallet, solana_connection, filters, tokenAccounts, unsafe_nft_array, safe_nft_array, re, account_reducer, nft_accounts;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"));
                    metaplex = new js_1.Metaplex(connection);
                    wallet = "F7wfhMExqYNdgTUZz9web8CtCZELxaHCAZXXrbQbrVED";
                    solana_connection = new web3_js_1.Connection("https://api.devnet.solana.com"
                    // "https://special-responsive-dinghy.solana-mainnet.discover.quiknode.pro/5158345c25d3630b3f69ba4d4b524822351941b1/"
                    );
                    filters = [
                        {
                            //limiting the size to 165 - filtering
                            dataSize: 165
                        },
                        {
                            //memory comparison - in 165 bytes at byte 32 we start(wallets start at 32nd place)
                            memcmp: {
                                offset: 32,
                                bytes: wallet
                            }
                        },
                    ];
                    return [4 /*yield*/, solana_connection.getParsedProgramAccounts(spl_token_1.TOKEN_PROGRAM_ID, {
                            filters: filters
                        })];
                case 1:
                    tokenAccounts = _a.sent();
                    unsafe_nft_array = [];
                    safe_nft_array = [];
                    re = /(https?:\/\/|www\.)[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+([/?#]\S*)?/g;
                    account_reducer = function (acc, accB) {
                        var _a, _b;
                        if (Buffer.isBuffer(accB.account.data)) {
                            return acc;
                        }
                        var newMintAddress = (_b = (_a = accB.account.data.parsed) === null || _a === void 0 ? void 0 : _a.info) === null || _b === void 0 ? void 0 : _b.mint;
                        if (!newMintAddress) {
                            return acc;
                        }
                        acc.push(new web3_js_1.PublicKey(newMintAddress));
                        return acc;
                    };
                    nft_accounts = tokenAccounts.reduce(account_reducer, []);
                    return [4 /*yield*/, dist_1["default"]["for"](nft_accounts)
                            .withConcurrency(10)
                            .process(function (mintAddress) { return __awaiter(_this, void 0, void 0, function () {
                            var nft;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, metaplex.nfts().findByMint({ mintAddress: mintAddress })];
                                    case 1:
                                        nft = _b.sent();
                                        if (((_a = nft === null || nft === void 0 ? void 0 : nft.json) === null || _a === void 0 ? void 0 : _a.description) && re.test(nft.json.description)) {
                                            unsafe_nft_array.push(nft);
                                        }
                                        else {
                                            safe_nft_array.push(nft);
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 2:
                    _a.sent();
                    console.log(unsafe_nft_array);
                    console.log(safe_nft_array);
                    return [2 /*return*/];
            }
        });
    });
}
nft_Array_Sort();
