import React from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";

interface Props {
  selected: string[];
  setSelected: (symbols: string[]) => void;
}

// Sample stock symbols
const STOCK_SYMBOLS = ["AAPL", "TSLA", "GOOGL", "MSFT", "AMZN", "META", "NFLX", "NVDA"];

export const StockSelector: React.FC<Props> = ({ selected, setSelected }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">🔍 Select Stock Symbol(s)</label>
      <Typeahead
        id="stock-selector"
        multiple
        options={STOCK_SYMBOLS}
        selected={selected}
        onChange={(selectedItems) => setSelected(selectedItems as string[])}
        placeholder="Choose a stock..."
      />
    </div>
  );
};
