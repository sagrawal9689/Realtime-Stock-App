import { Request, Response } from 'express';
import Price from '../models/Price';

export const getPrices = async (req: Request, res: Response) => {
  const { symbol } = req.params;
  try {
    const prices = await Price.find({ symbol }).sort({ timestamp: -1 }).limit(20);
    res.json(prices);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
};
