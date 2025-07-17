export interface Alert {
    id: number;
    symbol: string;
    condition: string; // ">" or "<"
    targetPrice: number;
    triggered: boolean;
    triggeredAt?: string; // ISO string
  }
  