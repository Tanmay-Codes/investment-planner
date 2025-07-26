import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Target,
  AlertTriangle,
  Brain,
} from "lucide-react";
import { Database } from "@/types/supabase";

type StockAnalysis = Database["public"]["Tables"]["stock_analysis"]["Row"];

interface StockScannerTableProps {
  stocks: StockAnalysis[];
  onAddToWatchlist: (stock: StockAnalysis) => void;
  loading?: boolean;
}

const StockScannerTable = ({
  stocks = [],
  onAddToWatchlist,
  loading = false,
}: StockScannerTableProps) => {
  const formatCurrency = (value: number | null) => {
    if (value === null) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number | null, decimals = 2) => {
    if (value === null) return "N/A";
    return value.toFixed(decimals);
  };

  const formatMarketCap = (value: number | null) => {
    if (value === null) return "N/A";
    if (value >= 1e12) return `₹${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `₹${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `₹${(value / 1e6).toFixed(1)}M`;
    return `₹${value.toFixed(0)}`;
  };

  const getRecommendationColor = (recommendation: string | null) => {
    switch (recommendation?.toUpperCase()) {
      case "BUY":
        return "bg-green-100 text-green-800";
      case "HOLD":
        return "bg-yellow-100 text-yellow-800";
      case "SELL":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskColor = (risk: string | null) => {
    switch (risk?.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAIScoreColor = (score: number | null) => {
    if (score === null) return "text-gray-500";
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm">
        <CardContent className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text="Analyzing stocks with AI..." />
        </CardContent>
      </Card>
    );
  }

  if (stocks.length === 0) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Stocks Match Your Criteria
          </h3>
          <p className="text-gray-600 text-center">
            Try adjusting your screening rules to find more investment
            opportunities
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI Stock Analysis Results ({stocks.length} stocks)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-900">
                  Stock
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Price
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Market Cap
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  P/E
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  P/B
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  ROE
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Revenue Growth
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  AI Score
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Recommendation
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Risk
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Target
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stocks.map((stock) => (
                <TableRow
                  key={stock.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">
                        {stock.symbol}
                      </div>
                      <div className="text-sm text-gray-600 truncate max-w-[150px]">
                        {stock.company_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {stock.sector}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      {formatCurrency(stock.current_price)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      {formatMarketCap(stock.market_cap)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      {formatNumber(stock.pe_ratio)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      {formatNumber(stock.pb_ratio)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-900">
                        {formatNumber(stock.roe)}%
                      </span>
                      {stock.roe && stock.roe > 15 && (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-900">
                        {formatNumber(stock.revenue_growth)}%
                      </span>
                      {stock.revenue_growth && stock.revenue_growth > 10 ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold text-lg ${getAIScoreColor(stock.ai_score)}`}
                      >
                        {formatNumber(stock.ai_score, 1)}
                      </span>
                      <span className="text-gray-500 text-sm">/10</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={getRecommendationColor(stock.recommendation)}
                    >
                      {stock.recommendation || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRiskColor(stock.risk_level)}>
                      {stock.risk_level || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium text-green-600">
                        {formatCurrency(stock.target_price)}
                      </div>
                      <div className="text-gray-500">
                        SL: {formatCurrency(stock.stop_loss)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAddToWatchlist(stock)}
                        className="text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Watch
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockScannerTable;
