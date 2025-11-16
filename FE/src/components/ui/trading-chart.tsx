import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  Maximize2,
  Volume2,
  Activity,
  Target
} from "lucide-react";

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TradingChartProps {
  ticker: string;
  currentPrice: number;
  priceChange24h: number;
  priceData: Array<{ time: string; price: number; volume: number }>;
  entryPrice?: number;
  entryAmount?: number;
}

const TradingChart = ({ ticker, currentPrice, priceChange24h, priceData, entryPrice = 0.000034, entryAmount = 500 }: TradingChartProps) => {
  const [timeframe, setTimeframe] = useState("1D");
  const [viewMode, setViewMode] = useState("candlestick");

  const isPositive = priceChange24h >= 0;
  
  // Convert price data to candlestick data
  const candleData: CandleData[] = priceData.map((point, index) => {
    const prevPrice = index > 0 ? priceData[index - 1].price : point.price;
    const variation = point.price * 0.05; // 5% variation for demo
    return {
      time: point.time,
      open: prevPrice,
      high: Math.max(point.price, prevPrice) + variation * 0.3,
      low: Math.min(point.price, prevPrice) - variation * 0.2,
      close: point.price,
      volume: point.volume
    };
  });
  
  // Calculate scaling
  const allPrices = candleData.flatMap(d => [d.open, d.high, d.low, d.close]);
  const volumes = candleData.map(d => d.volume);
  const maxPrice = Math.max(...allPrices);
  const minPrice = Math.min(...allPrices);
  const maxVolume = Math.max(...volumes);
  const priceRange = maxPrice - minPrice;
  
  // Calculate current profit/loss
  const currentValue = (entryAmount / entryPrice) * currentPrice;
  const profitLoss = currentValue - entryAmount;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/40">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              {ticker}
              <Badge variant={isPositive ? "default" : "destructive"} className={isPositive ? "bg-accent/20 text-accent border-accent/20" : ""}>
                {isPositive ? "+" : ""}{priceChange24h.toFixed(2)}%
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold">${currentPrice.toFixed(4)}</span>
              {isPositive ? (
                <TrendingUp className="h-5 w-5 text-accent" />
              ) : (
                <TrendingDown className="h-5 w-5 text-destructive" />
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Timeframe Buttons */}
        <div className="flex gap-1 mt-3">
          {["5m", "15m", "1H", "4H", "1D", "1W"].map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Chart Area */}
        <div className="relative h-80 mb-4 bg-background/20 rounded-lg overflow-hidden">
          {/* Candlestick Chart */}
          <svg className="w-full h-full">
            {/* Grid Lines */}
            <defs>
              <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 20" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Entry Price Line */}
            {entryPrice && (
              <>
                <line
                  x1="0%"
                  y1={`${100 - ((entryPrice - minPrice) / priceRange) * 85}%`}
                  x2="100%"
                  y2={`${100 - ((entryPrice - minPrice) / priceRange) * 85}%`}
                  stroke="hsl(var(--accent))"
                  strokeWidth="2"
                  strokeDasharray="8,4"
                  opacity="0.8"
                />
                <text
                  x="4"
                  y={`${100 - ((entryPrice - minPrice) / priceRange) * 85}%`}
                  fill="hsl(var(--accent))"
                  fontSize="11"
                  dy="-4"
                  className="font-medium"
                >
                  Entry: ${entryPrice.toFixed(6)}
                </text>
              </>
            )}
            
            {/* Current Price Line */}
            <line
              x1="0%"
              y1={`${100 - ((currentPrice - minPrice) / priceRange) * 85}%`}
              x2="100%"
              y2={`${100 - ((currentPrice - minPrice) / priceRange) * 85}%`}
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              opacity="0.9"
            />
            <text
              x="4"
              y={`${100 - ((currentPrice - minPrice) / priceRange) * 85}%`}
              fill="hsl(var(--primary))"
              fontSize="11"
              dy="-4"
              className="font-medium"
            >
              Current: ${currentPrice.toFixed(6)}
            </text>
            
            {/* Candlesticks */}
            {candleData.map((candle, index) => {
              const x = ((index + 0.5) / candleData.length) * 100;
              const candleWidth = (1 / candleData.length) * 60; // 60% of available width
              
              const openY = 100 - ((candle.open - minPrice) / priceRange) * 85;
              const closeY = 100 - ((candle.close - minPrice) / priceRange) * 85;
              const highY = 100 - ((candle.high - minPrice) / priceRange) * 85;
              const lowY = 100 - ((candle.low - minPrice) / priceRange) * 85;
              
              const isGreen = candle.close >= candle.open;
              const bodyColor = isGreen ? "hsl(var(--accent))" : "hsl(var(--destructive))";
              
              return (
                <g key={index}>
                  {/* Wick */}
                  <line
                    x1={`${x}%`}
                    y1={`${highY}%`}
                    x2={`${x}%`}
                    y2={`${lowY}%`}
                    stroke={bodyColor}
                    strokeWidth="1"
                  />
                  {/* Body */}
                  <rect
                    x={`${x - candleWidth / 2}%`}
                    y={`${Math.min(openY, closeY)}%`}
                    width={`${candleWidth}%`}
                    height={`${Math.abs(closeY - openY)}%`}
                    fill={isGreen ? bodyColor : "transparent"}
                    stroke={bodyColor}
                    strokeWidth="1"
                    opacity={isGreen ? "0.8" : "1"}
                  />
                </g>
              );
            })}
            
            {/* PnL Annotation */}
            <text
              x="50%"
              y="20"
              fill="hsl(var(--accent))"
              fontSize="14"
              fontWeight="bold"
              textAnchor="middle"
              className="font-bold"
            >
              +{priceChange24h.toFixed(0)}% PnL
            </text>
          </svg>
          
          {/* Profit Label */}
          <div className="absolute bottom-4 left-4 bg-accent/20 border border-accent/30 rounded-lg px-3 py-2 text-sm">
            <div className="text-accent font-semibold">
              If you sell now → ${entryAmount} → ${currentValue.toFixed(0)}
            </div>
            <div className="text-xs text-muted-foreground">
              Profit: +${profitLoss.toFixed(0)}
            </div>
          </div>
        </div>

        {/* Volume Chart */}
        <div className="h-16 bg-background/10 rounded-lg mb-4 overflow-hidden">
          <div className="flex items-end h-full px-1">
            {priceData.map((point, index) => (
              <div
                key={index}
                className="flex-1 mx-px"
                style={{
                  height: `${(point.volume / maxVolume) * 100}%`,
                  backgroundColor: point.price >= (priceData[index - 1]?.price || point.price) 
                    ? "hsl(var(--accent))" 
                    : "hsl(var(--destructive))",
                  opacity: 0.6
                }}
              />
            ))}
          </div>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center p-3 bg-background/20 rounded-lg">
            <div className="text-muted-foreground">24h Volume</div>
            <div className="font-semibold">${volumes.reduce((a, b) => a + b, 0).toLocaleString()}</div>
          </div>
          <div className="text-center p-3 bg-background/20 rounded-lg">
            <div className="text-muted-foreground">24h High</div>
            <div className="font-semibold">${maxPrice.toFixed(4)}</div>
          </div>
          <div className="text-center p-3 bg-background/20 rounded-lg">
            <div className="text-muted-foreground">24h Low</div>
            <div className="font-semibold">${minPrice.toFixed(4)}</div>
          </div>
        </div>

        {/* DEX Info */}
        <div className="mt-4 p-3 bg-background/10 rounded-lg">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Activity className="h-3 w-3 text-accent" />
              <span>Raydium • Jupiter • Orca</span>
            </div>
            <Badge variant="outline" className="text-xs">
              Solana
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingChart;