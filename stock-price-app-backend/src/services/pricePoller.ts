import axios from 'axios';
import Price from '../models/Price';
import { Server } from 'socket.io';

// Define the expected structure of the API response
interface ApiResponse {
  [key: string]: {
    usd: number;
  };
}

const fetchAndStorePrices = (io: Server) => {
  setInterval(async () => {
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
      const response = await axios.get<ApiResponse>(apiUrl, { params,headers });
      const prices = response.data;

      console.log(prices,'prices')

      for (const [symbol, data] of Object.entries(prices)) {
        const priceEntry = await Price.create({
          symbol,
          price: data.usd,
        });

        io.emit('priceUpdate', priceEntry);
      }
    } catch (error:any) {
      if (error.response && error.response.status === 429) {
        console.log('Rate limit exceeded for api.coingecko');
      }
      else
      {
        console.error('Error fetching or storing prices:', error);
      }
    }
  }, 15000);
};

export default fetchAndStorePrices;
