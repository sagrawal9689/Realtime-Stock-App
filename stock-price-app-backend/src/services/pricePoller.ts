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
    const apiUrl = 'https://api.livecoinwatch.com/coins/list';

    const headers = {
      'content-type': 'application/json',
      'x-api-key': 'e24fc0f8-b32a-4a0c-96c8-79e6cf4e4c84',
    };

    const requestBody = {
      currency: "USD",
      sort: "rank",
      order: "ascending",
      offset: 0,
      limit: 30,
      meta: false
    };

    try {
      const response:any = await axios.post<ApiResponse>(apiUrl, requestBody ,{ headers });

      // Mapping of cryptocurrency names to their codes
      const symbolToCodeMapping = { 
        "bitcoin": "BTC", 
        "ethereum": "ETH", 
        "litecoin": "LTC", 
        "chainlink": "LINK", 
        "cardano": "ADA" 
      };

      const codeToSymbolMapping = Object.fromEntries(
        Object.entries(symbolToCodeMapping).map(([symbol, code]) => [code, symbol])
      );

      const codesOfInterest = Object.values(symbolToCodeMapping);

      const filteredData:any = response.data.filter((coin:any)=> codesOfInterest.includes(coin.code)).map((item:any) =>{
        return {
          symbol: codeToSymbolMapping[item.code],
          price: item.rate
        }
      });
      
      console.log(filteredData,'filterdaata')

      for(const coin of filteredData)
      {
          const priceEntry = await Price.create({
            symbol: coin.symbol,
            price: coin.price,
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
  }, 5000);
};

export default fetchAndStorePrices;
