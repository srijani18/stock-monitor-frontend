import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Alert } from "../types/Alert";

export const AlertForm: React.FC<{ sendAlert: (alert: Omit<Alert, "id" | "triggered" | "triggeredAt">) => void }> = ({ sendAlert }) => {
  const [symbol, setSymbol] = useState("AAPL");
  const [condition, setCondition] = useState<">" | "<">(">");
  const [targetPrice, setTargetPrice] = useState(200);

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      sendAlert({ symbol, condition, targetPrice });
    }}>
      <Form.Group className="mb-3">
        <Form.Label>Stock Symbol</Form.Label>
        <Form.Control value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Condition</Form.Label>
        <Form.Select value={condition} onChange={(e) => setCondition(e.target.value as ">" | "<")}>
          <option value=">">Above</option>
          <option value="<">Below</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Target Price</Form.Label>
        <Form.Control type="number" value={targetPrice} onChange={(e) => setTargetPrice(+e.target.value)} />
      </Form.Group>

      <Button type="submit" variant="primary">Create Alert</Button>
    </form>
  );
};
