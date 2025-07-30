
  

export interface Alert {
  id: number;
  symbol: string;
  condition: ">" | "<";
  targetPrice: number;
  triggered: boolean;
  triggeredAt?: string;
}
