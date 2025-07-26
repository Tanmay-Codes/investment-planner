import axios from "axios";

// Yahoo Finance API alternative - using Alpha Vantage or similar
// For demo purposes, we'll use a free API that doesn't require authentication
// In production, you might want to use a paid service for better reliability

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  pe?: number;
  high52Week?: number;
  low52Week?: number;
}

interface StockQuote {
  "01. symbol": string;
  "02. open": string;
  "03. high": string;
  "04. low": string;
  "05. price": string;
  "06. volume": string;
  "07. latest trading day": string;
  "08. previous close": string;
  "09. change": string;
  "10. change percent": string;
}

// Free API endpoints for stock data
const ALPHA_VANTAGE_API_KEY = "demo"; // Replace with actual API key
const ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query";

// Alternative free API for Indian stocks
const INDIAN_STOCK_API_BASE = "https://api.kite.trade"; // Zerodha Kite API (requires authentication)

// For demo purposes, we'll create a mock service that simulates real data
class StockDataService {
  private mockData: { [key: string]: StockData } = {
    RELIANCE: {
      symbol: "RELIANCE",
      price: 2456.75,
      change: 23.45,
      changePercent: 0.96,
      volume: 1234567,
      marketCap: 1658000000000,
      pe: 24.5,
      high52Week: 2856.0,
      low52Week: 2100.0,
    },
    TCS: {
      symbol: "TCS",
      price: 3567.8,
      change: -12.3,
      changePercent: -0.34,
      volume: 987654,
      marketCap: 1298000000000,
      pe: 28.7,
      high52Week: 4150.0,
      low52Week: 3200.0,
    },
    HDFCBANK: {
      symbol: "HDFCBANK",
      price: 1678.9,
      change: 8.75,
      changePercent: 0.52,
      volume: 2345678,
      marketCap: 925000000000,
      pe: 19.8,
      high52Week: 1895.0,
      low52Week: 1450.0,
    },
    INFY: {
      symbol: "INFY",
      price: 1456.25,
      change: 15.6,
      changePercent: 1.08,
      volume: 1876543,
      marketCap: 602000000000,
      pe: 26.3,
      high52Week: 1735.0,
      low52Week: 1200.0,
    },
    NIFTY50: {
      symbol: "NIFTY50",
      price: 19567.85,
      change: 145.3,
      changePercent: 0.75,
      volume: 0,
      marketCap: 0,
      pe: 22.1,
      high52Week: 21800.0,
      low52Week: 16800.0,
    },
  };

  // Simulate real-time data with small random fluctuations
  private addRandomFluctuation(basePrice: number): number {
    const fluctuation = (Math.random() - 0.5) * 0.02; // ±1% fluctuation
    return basePrice * (1 + fluctuation);
  }

  async getStockQuote(symbol: string): Promise<StockData | null> {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const baseData = this.mockData[symbol.toUpperCase()];
      if (!baseData) {
        throw new Error(`Stock symbol ${symbol} not found`);
      }

      // Add real-time fluctuation
      const currentPrice = this.addRandomFluctuation(baseData.price);
      const change = currentPrice - baseData.price;
      const changePercent = (change / baseData.price) * 100;

      return {
        ...baseData,
        price: currentPrice,
        change,
        changePercent,
      };
    } catch (error) {
      console.error(`Error fetching stock data for ${symbol}:`, error);
      return null;
    }
  }

  async getMultipleStockQuotes(symbols: string[]): Promise<StockData[]> {
    const promises = symbols.map((symbol) => this.getStockQuote(symbol));
    const results = await Promise.all(promises);
    return results.filter((data) => data !== null) as StockData[];
  }

  async getMarketOverview(): Promise<StockData[]> {
    const majorStocks = ["RELIANCE", "TCS", "HDFCBANK", "INFY", "NIFTY50"];
    return this.getMultipleStockQuotes(majorStocks);
  }

  // Method to integrate with Alpha Vantage API (requires API key)
  async getAlphaVantageQuote(symbol: string): Promise<StockData | null> {
    try {
      const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
        params: {
          function: "GLOBAL_QUOTE",
          symbol: symbol,
          apikey: ALPHA_VANTAGE_API_KEY,
        },
      });

      const quote = response.data["Global Quote"] as StockQuote;
      if (!quote) {
        throw new Error("Invalid response from Alpha Vantage");
      }

      return {
        symbol: quote["01. symbol"],
        price: parseFloat(quote["05. price"]),
        change: parseFloat(quote["09. change"]),
        changePercent: parseFloat(quote["10. change percent"].replace("%", "")),
        volume: parseInt(quote["06. volume"]),
      };
    } catch (error) {
      console.error("Error fetching from Alpha Vantage:", error);
      return null;
    }
  }

  // Framework for Zerodha API integration (placeholder)
  async getZerodhaPortfolioData(accessToken: string): Promise<any> {
    // This is a placeholder for future Zerodha API integration
    // You would need to implement OAuth flow and use Kite Connect API
    console.log(
      "Zerodha API integration - placeholder for future implementation",
    );

    // Mock portfolio data structure that Zerodha API would return
    return {
      holdings: [
        {
          tradingsymbol: "RELIANCE",
          quantity: 100,
          average_price: 2400.0,
          last_price: 2456.75,
          pnl: 5675.0,
        },
        {
          tradingsymbol: "TCS",
          quantity: 50,
          average_price: 3500.0,
          last_price: 3567.8,
          pnl: 3390.0,
        },
      ],
      total_value: 423390.0,
      total_pnl: 9065.0,
      total_pnl_percent: 2.18,
    };
  }

  // AI Analysis using Gemini (placeholder)
  async getAIStockAnalysis(symbol: string, apiKey: string): Promise<any> {
    // This would integrate with Gemini 1.5 Flash API
    console.log("Gemini AI analysis - placeholder for future implementation");

    // Mock AI analysis response
    return {
      symbol,
      analysis: {
        recommendation: "BUY",
        confidence: 0.78,
        target_price: 2650.0,
        stop_loss: 2300.0,
        reasoning:
          "Strong fundamentals with good growth prospects in the energy sector.",
        technical_indicators: {
          rsi: 58.5,
          macd: "BULLISH",
          moving_average_50: 2420.0,
          moving_average_200: 2380.0,
        },
        news_sentiment: "POSITIVE",
      },
    };
  }
}

export const stockDataService = new StockDataService();
export type { StockData };
