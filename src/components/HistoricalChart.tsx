
import React, { useState } from "react";
import { ButtonGroup, Button, Row, Col, Spinner } from "react-bootstrap";
import rawDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";
import { HistoricalDataPoint } from "../types/HistoricalData.js";


const DatePicker = rawDatePicker as unknown as React.FC<any>;
interface Props {
  dataByRange: {
    "1H": HistoricalDataPoint[];
    "1D": HistoricalDataPoint[];
    "1W": HistoricalDataPoint[];
  };
  fetchCustomData?: (start: Date, end: Date) => Promise<HistoricalDataPoint[]>;
}



export const HistoricalChart: React.FC<Props> = ({ dataByRange, fetchCustomData }) => {
  const [range, setRange] = useState<"1H" | "1D" | "1W" | "Custom">("1H");
  const [customDates, setCustomDates] = useState<[Date | null, Date | null]>([null, null]);
  const [customData, setCustomData] = useState<HistoricalDataPoint[]>([]);
  const [loading, setLoading] = useState(false);

  const [startDate, endDate] = customDates;

  const handleRangeChange = (r: "1H" | "1D" | "1W" | "Custom") => {
    setRange(r);
    if (r !== "Custom") {
      setCustomDates([null, null]);
    }
  };

  const handleCustomDateChange = (dates: [Date | null, Date | null]) => {
  setCustomDates(dates);
  const [start, end] = dates;

  if (start && end && fetchCustomData) {
    setLoading(true);
    fetchCustomData(start, end)
      .then((result) => {
        setCustomData(result);
      })
      .catch((error) => {
        console.error("Error fetching custom historical data:", error);
        setCustomData([]);
      })
      .finally(() => setLoading(false));
  }
};


  const chartData = range === "Custom" ? customData : dataByRange[range];

  return (
    <div>
      <h5 className="mb-3">📉 Historical Price Trend</h5>

      <ButtonGroup className="mb-3">
        {(["1H", "1D", "1W", "Custom"] as const).map(r => (
          <Button
            key={r}
            variant={range === r ? "primary" : "outline-primary"}
            onClick={() => handleRangeChange(r)}
          >
            {r}
          </Button>
        ))}
      </ButtonGroup>

      {range === "Custom" && (
        <Row className="mb-3">
          <Col md={6}>
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update: [Date | null, Date | null]) => handleCustomDateChange(update)}
              maxDate={new Date()}
              className="form-control"
              placeholderText="Select date range"
              isClearable
              dateFormat="yyyy-MM-dd"
            />

          </Col>
        </Row>
      )}

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#007bff" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};


// import React, { useState } from "react";
// import { ButtonGroup, Button, Row, Col, Spinner } from "react-bootstrap";
// import rawDatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";
// import { HistoricalDataPoint } from "../types/HistoricalData";

// const DatePicker = rawDatePicker as unknown as React.FC<any>;

// interface Props {
//   dataByRange: {
//     "1H": HistoricalDataPoint[];
//     "1D": HistoricalDataPoint[];
//     "1W": HistoricalDataPoint[];
//   };
//   fetchCustomData?: (start: Date, end: Date) => Promise<HistoricalDataPoint[]>;
// }

// export const HistoricalChart: React.FC<Props> = ({ dataByRange, fetchCustomData }) => {
//   const [range, setRange] = useState<"1H" | "1D" | "1W" | "Custom">("1H");
//   const [customDates, setCustomDates] = useState<[Date | null, Date | null]>([null, null]);
//   const [customData, setCustomData] = useState<HistoricalDataPoint[]>([]);
//   const [loading, setLoading] = useState(false);

//   const [startDate, endDate] = customDates;

//   const handleRangeChange = (r: "1H" | "1D" | "1W" | "Custom") => {
//     setRange(r);
//     if (r !== "Custom") {
//       setCustomDates([null, null]);
//     }
//   };

//   const handleCustomDateChange = (dates: [Date | null, Date | null]) => {
//     setCustomDates(dates);
//     const [start, end] = dates;

//     if (start && end && fetchCustomData) {
//       setLoading(true);
//       fetchCustomData(start, end)
//         .then((result) => {
//           setCustomData(result);
//         })
//         .catch((error) => {
//           console.error("Error fetching custom historical data:", error);
//           setCustomData([]);
//         })
//         .finally(() => setLoading(false));
//     }
//   };

//   const chartData = range === "Custom" ? customData : dataByRange[range];

//   return (
//     <div>
//       <h5 className="mb-3">📉 Historical Price Trend</h5>

//       <ButtonGroup className="mb-3">
//         {(["1H", "1D", "1W", "Custom"] as const).map((r) => (
//           <Button
//             key={r}
//             variant={range === r ? "primary" : "outline-primary"}
//             onClick={() => handleRangeChange(r)}
//           >
//             {r}
//           </Button>
//         ))}
//       </ButtonGroup>

//       {range === "Custom" && (
//         <Row className="mb-3">
//           <Col md={6}>
//             <DatePicker
//               selectsRange
//               startDate={startDate}
//               endDate={endDate}
//               onChange={(update: [Date | null, Date | null]) => handleCustomDateChange(update)}
//               maxDate={new Date()}
//               className="form-control"
//               placeholderText="Select date range"
//               isClearable
//               dateFormat="yyyy-MM-dd"
//             />
//           </Col>
//         </Row>
//       )}

//       {loading ? (
//         <Spinner animation="border" />
//       ) : chartData.length > 0 ? (
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="time" />
//             <YAxis domain={["auto", "auto"]} />
//             <Tooltip />
//             <Line type="monotone" dataKey="price" stroke="#007bff" dot={false} />
//           </LineChart>
//         </ResponsiveContainer>
//       ) : (
//         <p>No data available for the selected range.</p>
//       )}
//     </div>
//   );
// };