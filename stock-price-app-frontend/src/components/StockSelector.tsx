import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { selectSymbol } from '../store/priceSlice';

const symbols = ['bitcoin', 'ethereum', 'litecoin', 'chainlink', 'cardano'];

const StockSelector: React.FC = () => {
  const dispatch = useDispatch();
  const selectedSymbol = useSelector((state: RootState) => state.prices.selectedSymbol);
  const [showModal, setShowModal] = useState(false);

  const handleSelectSymbol = (symbol: string) => {
    dispatch(selectSymbol(symbol));
    setShowModal(false);
  };

  return (
    <div className="d-flex align-items-center">
      <label className="me-2 mb-0 text-white">Selected Stock:</label>
      <button
        type="button"
        className="btn btn-primary dropdown-toggle"
        onClick={() => setShowModal(true)}
        title="Click to select a stock or cryptocurrency"
      >
        {selectedSymbol}
      </button>

      {/* Modal */}
      <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex={-1} aria-labelledby="modalLabel" aria-hidden={!showModal}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalLabel">Select Stock or Crypto</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p className="text-muted">Select a stock or cryptocurrency from the list below:</p>
              <ul className="list-group">
                {symbols.map((symbol) => (
                  <li key={symbol} className="list-group-item">
                    <button
                      className="btn btn-outline-primary w-100"
                      onClick={() => handleSelectSymbol(symbol)}
                    >
                      {symbol}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Backdrop */}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default StockSelector;
