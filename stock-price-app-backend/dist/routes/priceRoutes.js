"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const priceController_1 = require("../controllers/priceController");
const router = (0, express_1.Router)();
router.get('/prices/:symbol', priceController_1.getPrices);
exports.default = router;
