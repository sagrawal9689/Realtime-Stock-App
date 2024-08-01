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
const Price_1 = __importDefault(require("../models/Price"));
const fetchAndStorePrices = (io) => {
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        const apiUrl = 'https://api.coingecko.com/api/v3/simple/price';
        const params = {
            ids: 'bitcoin,ethereum,litecoin,chainlink,cardano',
            vs_currencies: 'usd',
        };
        const headers = {
            accept: 'application/json',
            'x-cg-demo-api-key': 'CG-1mpcXwhDaCrUAdpjAR5fcduW',
        };
        try {
            const response = yield axios_1.default.get(apiUrl, { params, headers });
            const prices = response.data;
            console.log(prices, 'prices');
            for (const [symbol, data] of Object.entries(prices)) {
                const priceEntry = yield Price_1.default.create({
                    symbol,
                    price: data.usd,
                });
                io.emit('priceUpdate', priceEntry);
            }
        }
        catch (error) {
            if (error.response && error.response.status === 429) {
                console.log('Rate limit exceeded for api.coingecko');
            }
            else {
                console.error('Error fetching or storing prices:', error);
            }
        }
    }), 15000);
};
exports.default = fetchAndStorePrices;
