import { Router } from 'express';
import { getPrices } from '../controllers/priceController';

const router = Router();

router.get('/prices/:symbol', getPrices);

export default router;
