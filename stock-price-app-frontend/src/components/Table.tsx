import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchPrices } from '../store/priceSlice';
import { initializeWebSocket, disconnectWebSocket } from '../utils/websocket';

const Table: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { pricesBySymbol, selectedSymbol, status, error } = useSelector((state: RootState) => state.prices);
  const prices = pricesBySymbol[selectedSymbol] || [];

  useEffect(() => {
    dispatch(fetchPrices(selectedSymbol)); // Fetch initial data

    // Initialize WebSocket connection
    initializeWebSocket(dispatch);

    // Clean up WebSocket connection on component unmount
    return () => {
      disconnectWebSocket();
    };
  }, [dispatch, selectedSymbol]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>{error}</p>;

  return (
    <div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Time</th>
            <th>Price (USD)</th>
          </tr>
        </thead>
        <tbody>
          {prices.slice(0, 20).map((price) => {
            const date = new Date(price.timestamp);
            const formattedTime = date.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              timeZoneName: 'short',
            });

            return (
              <tr key={price.timestamp} className="price-update">
                <td>{formattedTime}</td>
                <td>{price.price}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
