// components/HistoricalStockSelector.tsx
import React from "react";
import { Form } from "react-bootstrap";

interface Props {
  options: string[];
  selected: string;
  onChange: (symbol: string) => void;
}

export const HistoricalStockSelector: React.FC<Props> = ({ options, selected, onChange }) => (
  <Form.Group>
    <Form.Label>Select Stock for Historical Data</Form.Label>
    <Form.Control
      as="select"
      value={selected}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">-- Select --</option>
      {options.map((symbol) => (
        <option key={symbol} value={symbol}>
          {symbol}
        </option>
      ))}
    </Form.Control>
  </Form.Group>
);
