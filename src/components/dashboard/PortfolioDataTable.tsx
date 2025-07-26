import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  Eye,
} from "lucide-react";
import { format } from "date-fns";

type PortfolioEntry = {
  id: string;
  entry_date: string;
  portfolio_value: number;
  gain_percent: number;
  notes?: string;
  created_at: string;
};

interface PortfolioDataTableProps {
  entries: PortfolioEntry[];
  onRefresh: () => void;
  loading?: boolean;
}

const PortfolioDataTable = ({
  entries = [],
  onRefresh,
  loading = false,
}: PortfolioDataTableProps) => {
  const [showChart, setShowChart] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    const sign = percent >= 0 ? "+" : "";
    return `${sign}${percent.toFixed(2)}%`;
  };

  const getGainColor = (percent: number) => {
    return percent >= 0 ? "text-green-600" : "text-red-600";
  };

  const getGainIcon = (percent: number) => {
    return percent >= 0 ? (
      <TrendingUp className="h-4 w-4" />
    ) : (
      <TrendingDown className="h-4 w-4" />
    );
  };

  const calculateStats = () => {
    if (entries.length === 0) return null;

    const latestEntry = entries[0];
    const oldestEntry = entries[entries.length - 1];
    const totalGrowth =
      ((latestEntry.portfolio_value - oldestEntry.portfolio_value) /
        oldestEntry.portfolio_value) *
      100;
    const avgGain =
      entries.reduce((sum, entry) => sum + entry.gain_percent, 0) /
      entries.length;

    return {
      totalGrowth,
      avgGain,
      highestValue: Math.max(...entries.map((e) => e.portfolio_value)),
      lowestValue: Math.min(...entries.map((e) => e.portfolio_value)),
    };
  };

  const stats = calculateStats();

  if (loading && entries.length === 0) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading portfolio data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Growth</p>
                  <p
                    className={`text-lg font-semibold ${getGainColor(stats.totalGrowth)}`}
                  >
                    {formatPercent(stats.totalGrowth)}
                  </p>
                </div>
                {getGainIcon(stats.totalGrowth)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Gain</p>
                  <p
                    className={`text-lg font-semibold ${getGainColor(stats.avgGain)}`}
                  >
                    {formatPercent(stats.avgGain)}
                  </p>
                </div>
                <BarChart3 className="h-4 w-4 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Highest Value</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(stats.highestValue)}
                  </p>
                </div>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Entries</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {entries.length}
                  </p>
                </div>
                <Calendar className="h-4 w-4 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Data Table */}
      <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Portfolio History ({entries.length} entries)
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowChart(!showChart)}
                className="rounded-full"
              >
                <Eye className="mr-2 h-4 w-4" />
                {showChart ? "Hide" : "Show"} Chart
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={loading}
                className="rounded-full"
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Portfolio Entries
              </h3>
              <p className="text-gray-600">
                Start by adding your first portfolio entry to track your
                investment performance
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Portfolio Value</TableHead>
                    <TableHead>Gain/Loss</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Added On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">
                        {format(new Date(entry.entry_date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(entry.portfolio_value)}
                      </TableCell>
                      <TableCell>
                        <div
                          className={`flex items-center gap-1 ${getGainColor(entry.gain_percent)}`}
                        >
                          {getGainIcon(entry.gain_percent)}
                          <span className="font-medium">
                            {formatPercent(entry.gain_percent)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {entry.notes ? (
                          <span className="text-sm text-gray-600">
                            {entry.notes.length > 50
                              ? `${entry.notes.substring(0, 50)}...`
                              : entry.notes}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {format(new Date(entry.created_at), "MMM dd, HH:mm")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chart Placeholder */}
      {showChart && entries.length > 0 && (
        <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Portfolio Growth Chart
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Chart visualization will be implemented with a charting
                  library
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Consider integrating Chart.js or Recharts for data
                  visualization
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PortfolioDataTable;
