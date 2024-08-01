import React from 'react';
import StockSelector from './components/StockSelector';
import Table from './components/Table';

const App: React.FC = () => {
  return (
    <div className="container mt-4">
      <header className="text-center mb-4">
        <h1 className="display-4 text-light">Real-Time Stock Prices</h1>
      </header>

      <div className="d-flex justify-content-end mb-4">
        <StockSelector />
      </div>

      <div className="table-responsive">
        <Table />
      </div>
    </div>
  );
};

export default App;
