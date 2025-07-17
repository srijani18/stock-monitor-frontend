import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { StockSelector } from "../components/StockSelector";
import { HistoricalStockSelector } from "../components/HistoricalStockSelector";
import { LivePriceChart } from "../components/LivePriceChart";
import { StockSummaryCard, StockSummary } from "../components/StockSummaryCard";
import { HistoricalChart } from "../components/HistoricalChart";
import { ActiveAlertsAccordion } from "../components/ActiveAlertsAccordion";
import { ActiveAlerts } from "../components/ActiveAlerts";
import { Alert } from "../types/Alert";
import { HistoricalDataPoint } from "../types/HistoricalData";
import keycloak from "../authentication/KeycloakService";
import axios from "axios";

// const mockSummaries: StockSummary[] = [
//   { symbol: "AAPL", price: 193.45, changePercent: 1.23, volume: "5.3M", lastUpdated: new Date().toLocaleTimeString() },
//   { symbol: "TSLA", price: 220.14, changePercent: -0.87, volume: "3.2M", lastUpdated: new Date().toLocaleTimeString() },
//   { symbol: "GOOGL", price: 135.67, changePercent: 0.00, volume: "4.1M", lastUpdated: new Date().toLocaleTimeString() },
// ];

const sampleAlerts: Alert[] = [
  { id: 1, symbol: "AAPL", condition: ">", targetPrice: 200, triggered: false },
  { id: 2, symbol: "GOOGL", condition: "<", targetPrice: 130, triggered: true, triggeredAt: "2025-06-04T10:45:00Z" },
];

// const mockData1H: HistoricalDataPoint[] = [
//   { time: "10:00", price: 185 },
//   { time: "10:15", price: 187 },
//   { time: "10:30", price: 189 },
//   { time: "10:45", price: 190 },
//   { time: "11:00", price: 188 },
// ];

// const mockData1D: HistoricalDataPoint[] = [
//   { time: "09:00", price: 180 },
//   { time: "10:00", price: 185 },
//   { time: "11:00", price: 188 },
//   { time: "12:00", price: 190 },
//   { time: "13:00", price: 187 },
//   { time: "14:00", price: 189 },
//   { time: "15:00", price: 191 },
//   { time: "16:00", price: 193 },
// ];

// const mockData1W: HistoricalDataPoint[] = [
//   { time: "Mon", price: 178 },
//   { time: "Tue", price: 182 },
//   { time: "Wed", price: 185 },
//   { time: "Thu", price: 187 },
//   { time: "Fri", price: 190 },
//   { time: "Sat", price: 189 },
//   { time: "Sun", price: 192 },
// ];

// const dataByRange: Record<"1H" | "1D" | "1W", HistoricalDataPoint[]> = {
//   "1H": mockData1H,
//   "1D": mockData1D,
//   "1W": mockData1W,
// };

// const mockCustomData = async (start: Date, end: Date): Promise<HistoricalDataPoint[]> => {
//   const data: HistoricalDataPoint[] = [];
//   const current = new Date(start);
//   while (current <= end) {
//     data.push({
//       time: current.toLocaleDateString(),
//       price: 170 + Math.floor(Math.random() * 20),
//     });
//     current.setDate(current.getDate() + 1);
//   }
//   return new Promise((resolve) => setTimeout(() => resolve(data), 500));
// };

// Convert ISO string to just date (or time if needed)
const formatDateTime = (dt: string) => {
  const date = new Date(dt);
  return date.toLocaleDateString();
};

export const fetchCustomHistoricalData = async (
  symbol: string,
  start: Date,
  end: Date
): Promise<HistoricalDataPoint[]> => {
  try {
    await keycloak.updateToken(30);
    const token = keycloak.token;

    const response = await axios.post(
      "http://localhost:8082/api/historical/custom",
      {
        symbol,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.map((point: any) => ({
      time: formatDateTime(point.timestamp),
      price: point.price,
    }));
  } catch (error) {
    console.error("Failed to fetch custom historical data:", error);
    return [];
  }
};
const Dashboard: React.FC = () => {
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [stockSummaries, setStockSummaries] = useState<StockSummary[]>([]);
  const [historicalSymbol, setHistoricalSymbol] = useState<string>(""); // Default or "" if none
  const [error, setError] = useState(false);
  const [historicalData, setHistoricalData] = useState<Record<"1H" | "1D" | "1W", HistoricalDataPoint[]>>({
  "1H": [],
  "1D": [],
  "1W": [],
  });

   useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = keycloak.token;
        const response = await fetch("http://localhost:8082/api/stocks/summary", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStockSummaries(data);
        } else {
          console.error("Failed to fetch stock summary:", response.status);
        }
      } catch (error) {
        console.error("Error fetching stock summary:", error);
      }
    };

    if (keycloak.authenticated) {
      fetchSummary();
    }
  }, []);

useEffect(() => {
    const fetchHistoricalByRange = async () => {
      if (!historicalSymbol) return;

      try {
        await keycloak.updateToken(30);
        const token = keycloak.token;

        const fetchRange = async (range: "1H" | "1D" | "1W") => {
          const response = await axios.get(
            `http://localhost:8082/api/historical/${historicalSymbol}/${range}`,
            
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = response.data;
          if (!data || data.length === 0) {
          throw new Error(`Empty data for ${range}`);
          }
          return data.map((point: any) => ({
            time: formatDateTime(point.timestamp),
            price: point.price,
          }));
        };

        const [data1H, data1D, data1W] = await Promise.all([
          fetchRange("1H"),
          fetchRange("1D"),
          fetchRange("1W"),
        ]);

        setHistoricalData({
          "1H": data1H,
          "1D": data1D,
          "1W": data1W,
        });
        setError(false);
      } catch (error) {
        console.error("Error fetching historical data:", error);
        setError(true); 
      }
    };

    fetchHistoricalByRange();
  }, [historicalSymbol]);
  // if (error) {
  //   return <div>😢 Oops, data not available.</div>;
  // }
  return (
    <Container fluid className="mt-4 px-4">
      {/* Stock Summary Cards */}
      <h5 className="mb-3">📦 Stock Summary</h5>
      <Row className="mb-4">
        {stockSummaries.map((summary) => (
          <StockSummaryCard key={summary.symbol} summary={summary} />
        ))}
      </Row>


      {/* Stock Selector */}
      <Row className="mb-4">
        <Col md={8}>
          <StockSelector selected={selectedSymbols} setSelected={setSelectedSymbols} />
        </Col>
      </Row>

      {/* Live Price Charts */}
      {selectedSymbols.length > 0 && (
        <>
          <h5 className="mb-3">📈 Live Price Charts</h5>
          <Row className="mb-4">
            {selectedSymbols.map((symbol) => (
              <Col md={6} key={symbol} className="mb-3">
                <LivePriceChart symbol={symbol} />
              </Col>
            ))}
          </Row>
        </>
      )}
      {/* Historical stock selector*/ }
      <Row className="mb-4">
        <Col md={6}>
          <HistoricalStockSelector
            options={stockSummaries.map((s) => s.symbol)}
            selected={historicalSymbol}
            onChange={setHistoricalSymbol}
          />
        </Col>
      </Row>


      {/* Historical Chart */}
      <Row className="mb-5">
        <Col>
          <HistoricalChart
            dataByRange={historicalData}
            fetchCustomData={(start, end) =>
              fetchCustomHistoricalData(historicalSymbol, start, end)
            }
          />


        </Col>
      </Row>

      {/* Alerts Section */}
      <h5 className="mb-3">🚨 Active Alerts</h5>
      <Row className="mb-5">
        <Col md={6}>
          <ActiveAlerts alerts={sampleAlerts} />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;

