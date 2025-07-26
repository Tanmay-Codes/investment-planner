import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarDays,
  BarChart2,
  Users,
  Clock,
  TrendingUp,
  DollarSign,
  Target,
  Brain,
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface InvestmentCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  allocation?: number;
}

interface DashboardGridProps {
  investments?: InvestmentCardProps[];
  isLoading?: boolean;
}

const defaultInvestments: InvestmentCardProps[] = [
  {
    title: "NIFTY 50 ETF",
    value: "₹2,45,000",
    change: "+2.4%",
    changeType: "positive",
    allocation: 35,
  },
  {
    title: "Reliance Industries",
    value: "₹85,000",
    change: "+1.8%",
    changeType: "positive",
    allocation: 15,
  },
  {
    title: "TCS",
    value: "₹65,000",
    change: "-0.5%",
    changeType: "negative",
    allocation: 12,
  },
  {
    title: "HDFC Bank",
    value: "₹55,000",
    change: "+0.8%",
    changeType: "positive",
    allocation: 10,
  },
];

const InvestmentCard = ({
  title,
  value,
  change,
  changeType,
  allocation,
}: InvestmentCardProps) => {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium text-gray-900">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
          <TrendingUp className="h-4 w-4 text-blue-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-2xl font-semibold text-gray-900">{value}</div>
            <div
              className={`text-sm font-medium flex items-center gap-1 ${
                changeType === "positive" ? "text-green-600" : "text-red-600"
              }`}
            >
              <span>{change}</span>
              <span className="text-xs text-gray-500">today</span>
            </div>
          </div>
          {allocation && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-gray-500">Portfolio Allocation</span>
                <span className="text-gray-900">{allocation}%</span>
              </div>
              <Progress
                value={allocation}
                className="h-2 bg-gray-100 rounded-full"
                style={
                  {
                    backgroundColor: "rgb(243, 244, 246)",
                  } as React.CSSProperties
                }
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardGrid = ({
  investments = defaultInvestments,
  isLoading = false,
}: DashboardGridProps) => {
  const [loading, setLoading] = useState(isLoading);

  // Simulate loading for demo purposes
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (loading) {
    return (
      <div className="p-6 h-full">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <Card
              key={index}
              className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm h-[220px] flex items-center justify-center"
            >
              <div className="flex flex-col items-center justify-center p-6">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full border-4 border-gray-100 border-t-blue-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-4 w-4 rounded-full bg-blue-500/20 animate-pulse" />
                  </div>
                </div>
                <p className="mt-4 text-sm font-medium text-gray-500">
                  Loading portfolio data...
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Summary Cards */}
        <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium text-gray-900">
              Total Portfolio Value
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900">
              ₹4,50,000
            </div>
            <p className="text-sm text-green-600 mt-1 font-medium">
              +₹12,500 (+2.9%) today
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium text-gray-900">
              AI Score
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center">
              <Brain className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900">8.2/10</div>
            <p className="text-sm text-gray-500 mt-1">Portfolio health score</p>
          </CardContent>
        </Card>
        <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium text-gray-900">
              Target Allocation
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center">
              <Target className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900">95%</div>
            <p className="text-sm text-gray-500 mt-1">On track with strategy</p>
          </CardContent>
        </Card>

        {/* Investment Cards */}
        {investments.map((investment, index) => (
          <InvestmentCard key={index} {...investment} />
        ))}
      </div>
    </div>
  );
};

export default DashboardGrid;
