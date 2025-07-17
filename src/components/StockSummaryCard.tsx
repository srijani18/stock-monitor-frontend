import React from "react";
import { Card, Col } from "react-bootstrap";

export interface StockSummary {
  symbol: string;
  // price: number;
  // changePercent: number;
  // volume: string;
  // lastUpdated: string;
  companyName: string;
  currentPrice: number;

}

interface Props {
  summary: StockSummary;
}

export const StockSummaryCard: React.FC<Props> = ({ summary }) => {
  // const changeColor = summary.changePercent > 0 ? "text-success" : summary.changePercent < 0 ? "text-danger" : "text-muted";

  return (
    <Col md={4} className="mb-4">
      <Card>
        <Card.Body>
          <Card.Title>{summary.symbol}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{summary.companyName}</Card.Subtitle>
          <Card.Text>
            {/* <strong>Current Price:</strong> ${summary.price.toFixed(2)} <br />
            <strong className={changeColor}>
              Change %: {summary.changePercent > 0 ? "+" : ""}{summary.changePercent.toFixed(2)}%
            </strong><br />
            <strong>Volume:</strong> {summary.volume} <br />
            <strong>Last Updated:</strong> {summary.lastUpdated} */}
            <strong>Current Price:</strong> ${summary.currentPrice.toFixed(2)}


          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};
