import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { motion } from "framer-motion";

interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  status: "pending" | "reviewing" | "implemented";
  priority: "high" | "medium" | "low";
  impact: string;
}

interface AIRecommendationBoardProps {
  recommendations?: AIRecommendation[];
  onRecommendationMove?: (
    recommendationId: string,
    newStatus: AIRecommendation["status"],
  ) => void;
  onRecommendationClick?: (recommendation: AIRecommendation) => void;
  isLoading?: boolean;
}

const defaultRecommendations: AIRecommendation[] = [
  {
    id: "1",
    title: "Rebalance Portfolio",
    description:
      "Your ETF allocation is 5% below target. Consider investing ₹25,000 in NIFTY 50 ETF.",
    status: "pending",
    priority: "high",
    impact: "Potential 2.1% annual return improvement",
  },
  {
    id: "2",
    title: "Diversify Tech Holdings",
    description:
      "Tech stocks represent 45% of your portfolio. Consider reducing exposure by ₹15,000.",
    status: "reviewing",
    priority: "medium",
    impact: "Risk reduction of 8%",
  },
  {
    id: "3",
    title: "Increase SIP Amount",
    description:
      "Based on your cash flow, you can increase monthly SIP by ₹5,000.",
    status: "implemented",
    priority: "low",
    impact: "₹2.4L additional wealth in 5 years",
  },
];

const AIRecommendationBoard = ({
  recommendations = defaultRecommendations,
  onRecommendationMove = () => {},
  onRecommendationClick = () => {},
  isLoading = false,
}: AIRecommendationBoardProps) => {
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
  const columns = [
    {
      id: "pending",
      title: "Pending Review",
      color: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      id: "reviewing",
      title: "Under Review",
      color: "bg-blue-50",
      borderColor: "border-blue-100",
    },
    {
      id: "implemented",
      title: "Implemented",
      color: "bg-green-50",
      borderColor: "border-green-100",
    },
  ];

  const handleDragStart = (e: React.DragEvent, recommendationId: string) => {
    e.dataTransfer.setData("recommendationId", recommendationId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (
    e: React.DragEvent,
    status: AIRecommendation["status"],
  ) => {
    e.preventDefault();
    const recommendationId = e.dataTransfer.getData("recommendationId");
    onRecommendationMove(recommendationId, status);
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            AI Recommendations
          </h2>
          <Button className="bg-purple-500 hover:bg-purple-600 text-white rounded-full px-4 h-9 shadow-sm transition-colors opacity-50 cursor-not-allowed">
            <PlusCircle className="mr-2 h-4 w-4" />
            Generate New
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6 h-[calc(100%-4rem)]">
          {columns.map((column) => (
            <div
              key={column.id}
              className={`${column.color} rounded-xl p-4 border ${column.borderColor}`}
            >
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <span
                  className={`h-2 w-2 rounded-full mr-2 ${column.id === "pending" ? "bg-orange-400" : column.id === "reviewing" ? "bg-blue-400" : "bg-green-400"}`}
                ></span>
                {column.title}
              </h3>
              <div className="space-y-3 flex flex-col items-center justify-center min-h-[200px]">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full border-4 border-gray-100 border-t-blue-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-blue-500/20 animate-pulse" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-500 mt-3">
                  Loading recommendations...
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          AI Recommendations
        </h2>
        <Button className="bg-purple-500 hover:bg-purple-600 text-white rounded-full px-4 h-9 shadow-sm transition-colors opacity-50 cursor-not-allowed">
          <PlusCircle className="mr-2 h-4 w-4" />
          Generate New
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6 h-[calc(100%-4rem)]">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`${column.color} rounded-xl p-4 border ${column.borderColor}`}
            onDrop={(e) =>
              handleDrop(e, column.id as AIRecommendation["status"])
            }
            onDragOver={handleDragOver}
          >
            <h3 className="font-medium text-gray-900 mb-4 flex items-center">
              <span
                className={`h-2 w-2 rounded-full mr-2 ${column.id === "pending" ? "bg-orange-400" : column.id === "reviewing" ? "bg-blue-400" : "bg-green-400"}`}
              ></span>
              {column.title}
            </h3>
            <div className="space-y-3">
              {recommendations
                .filter((recommendation) => recommendation.status === column.id)
                .map((recommendation) => (
                  <motion.div
                    key={recommendation.id}
                    layoutId={recommendation.id}
                    draggable
                    onDragStart={(e) =>
                      handleDragStart(e as any, recommendation.id)
                    }
                    onClick={() => onRecommendationClick(recommendation)}
                  >
                    <Card className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 rounded-xl border-0 bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">
                          {recommendation.title}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            recommendation.priority === "high"
                              ? "bg-red-100 text-red-700"
                              : recommendation.priority === "medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {recommendation.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {recommendation.description}
                      </p>
                      <div className="flex items-center mt-3 pt-3 border-t border-gray-100">
                        <span className="text-xs text-blue-600 font-medium">
                          Impact: {recommendation.impact}
                        </span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendationBoard;
