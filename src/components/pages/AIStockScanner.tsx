import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/components/ui/use-toast";
import {
  Brain,
  Search,
  Filter,
  TrendingUp,
  AlertTriangle,
  Target,
  Eye,
  Plus,
} from "lucide-react";
import { supabase } from "../../../supabase/supabase";
import { useAuth } from "../../../supabase/auth";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import StockScannerTable from "../ai/StockScannerTable";
import StockScannerRules from "../ai/StockScannerRules";
import { Database } from "@/types/supabase";

type StockAnalysis = Database["public"]["Tables"]["stock_analysis"]["Row"];
type ScreeningRule = Database["public"]["Tables"]["screening_rules"]["Row"];

const AIStockScanner = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [scanResults, setScanResults] = useState<StockAnalysis[]>([]);
  const [screeningRules, setScreeningRules] = useState<ScreeningRule[]>([]);
  const [selectedRule, setSelectedRule] = useState<string>("");
  const [activeTab, setActiveTab] = useState("scanner");
  const [scanHistory, setScanHistory] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (user) {
      loadScreeningRules();
      loadScanResults();
      loadWatchlist();
    }
  }, [user]);

  const loadScreeningRules = async () => {
    try {
      const { data, error } = await supabase
        .from("screening_rules")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setScreeningRules(data || []);
      if (data && data.length > 0) {
        setSelectedRule(data[0].id);
      }
    } catch (error) {
      console.error("Error loading screening rules:", error);
      toast({
        title: "Error",
        description: "Failed to load screening rules",
        variant: "destructive",
      });
    }
  };

  const loadScanResults = async () => {
    try {
      const { data, error } = await supabase
        .from("stock_analysis")
        .select("*")
        .order("ai_score", { ascending: false })
        .limit(50);

      if (error) throw error;
      setScanResults(data || []);
    } catch (error) {
      console.error("Error loading scan results:", error);
    }
  };

  const loadWatchlist = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("stock_watchlist")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWatchlist(data || []);
    } catch (error) {
      console.error("Error loading watchlist:", error);
    }
  };

  const runStockScan = async () => {
    if (!selectedRule || !user) {
      toast({
        title: "Error",
        description: "Please select a screening rule",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const startTime = Date.now();

    try {
      // Get the selected rule
      const rule = screeningRules.find((r) => r.id === selectedRule);
      if (!rule) throw new Error("Rule not found");

      const rules = rule.rules as any;

      // Build the query based on the rules
      let query = supabase.from("stock_analysis").select("*");

      // Apply filters based on the rules
      if (rules.market_cap_min) {
        query = query.gte("market_cap", rules.market_cap_min);
      }
      if (rules.market_cap_max) {
        query = query.lte("market_cap", rules.market_cap_max);
      }
      if (rules.pe_ratio_max) {
        query = query.lte("pe_ratio", rules.pe_ratio_max);
      }
      if (rules.pb_ratio_max) {
        query = query.lte("pb_ratio", rules.pb_ratio_max);
      }
      if (rules.debt_to_equity_max) {
        query = query.lte("debt_to_equity", rules.debt_to_equity_max);
      }
      if (rules.roe_min) {
        query = query.gte("roe", rules.roe_min);
      }
      if (rules.revenue_growth_min) {
        query = query.gte("revenue_growth", rules.revenue_growth_min);
      }
      if (rules.profit_growth_min) {
        query = query.gte("profit_growth", rules.profit_growth_min);
      }
      if (rules.dividend_yield_min) {
        query = query.gte("dividend_yield", rules.dividend_yield_min);
      }

      const { data, error } = await query
        .order("ai_score", { ascending: false })
        .limit(100);

      if (error) throw error;

      const executionTime = Date.now() - startTime;

      // Save scan history
      await supabase.from("scanner_history").insert({
        user_id: user.id,
        screening_rule_id: selectedRule,
        total_stocks_scanned: 1000, // Mock value
        stocks_passed: data?.length || 0,
        scan_results: { results: data },
        execution_time_ms: executionTime,
      });

      setScanResults(data || []);

      toast({
        title: "Scan Complete",
        description: `Found ${data?.length || 0} stocks matching your criteria in ${executionTime}ms`,
      });
    } catch (error) {
      console.error("Error running stock scan:", error);
      toast({
        title: "Error",
        description: "Failed to run stock scan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async (stock: StockAnalysis) => {
    if (!user) return;

    try {
      const { error } = await supabase.from("stock_watchlist").insert({
        user_id: user.id,
        symbol: stock.symbol,
        company_name: stock.company_name,
        added_price: stock.current_price,
        target_price: stock.target_price,
        stop_loss: stock.stop_loss,
        notes: `Added from AI Scanner - AI Score: ${stock.ai_score}`,
      });

      if (error) throw error;

      toast({
        title: "Added to Watchlist",
        description: `${stock.symbol} has been added to your watchlist`,
      });

      loadWatchlist();
    } catch (error: any) {
      if (error.code === "23505") {
        toast({
          title: "Already in Watchlist",
          description: `${stock.symbol} is already in your watchlist`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add to watchlist",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar activeItem="AI Stock Scanner" />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Brain className="h-8 w-8 text-purple-600" />
                  AI Stock Scanner
                </h1>
                <p className="text-gray-600 mt-1">
                  Discover investment opportunities with AI-powered stock
                  analysis
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="px-3 py-1">
                  {scanResults.length} stocks found
                </Badge>
                <Button
                  onClick={runStockScan}
                  disabled={loading || !selectedRule}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Run Scan
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Screening Rule Selection */}
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-blue-600" />
                  Screening Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label
                      htmlFor="rule-select"
                      className="text-sm font-medium text-gray-700"
                    >
                      Select Screening Rule
                    </Label>
                    <Select
                      value={selectedRule}
                      onValueChange={setSelectedRule}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Choose a screening rule" />
                      </SelectTrigger>
                      <SelectContent>
                        {screeningRules.map((rule) => (
                          <SelectItem key={rule.id} value={rule.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{rule.name}</span>
                              <span className="text-xs text-gray-500">
                                {rule.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("rules")}
                    className="mt-6"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Manage Rules
                  </Button>
                </div>
                {selectedRule && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Current Rule Criteria:
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      {screeningRules.find((r) => r.id === selectedRule) &&
                        Object.entries(
                          (screeningRules.find((r) => r.id === selectedRule)
                            ?.rules as any) || {},
                        ).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600 capitalize">
                              {key.replace(/_/g, " ")}:
                            </span>
                            <span className="font-medium">
                              {value as string}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="scanner">Scanner Results</TabsTrigger>
                <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
                <TabsTrigger value="rules">Manage Rules</TabsTrigger>
              </TabsList>

              <TabsContent value="scanner" className="space-y-4">
                {scanResults.length === 0 ? (
                  <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Search className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No Scan Results
                      </h3>
                      <p className="text-gray-600 text-center mb-6">
                        Select a screening rule and click "Run Scan" to discover
                        investment opportunities
                      </p>
                      <Button
                        onClick={runStockScan}
                        disabled={loading || !selectedRule}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        {loading ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Scanning...
                          </>
                        ) : (
                          <>
                            <Search className="mr-2 h-4 w-4" />
                            Run Your First Scan
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <StockScannerTable
                    stocks={scanResults}
                    onAddToWatchlist={addToWatchlist}
                    loading={loading}
                  />
                )}
              </TabsContent>

              <TabsContent value="watchlist" className="space-y-4">
                <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-green-600" />
                      Your Watchlist ({watchlist.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {watchlist.length === 0 ? (
                      <div className="text-center py-8">
                        <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No Stocks in Watchlist
                        </h3>
                        <p className="text-gray-600">
                          Add stocks from the scanner results to track them here
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {watchlist.map((stock: any) => (
                          <div
                            key={stock.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {stock.symbol}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {stock.company_name}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                ₹{stock.added_price}
                              </p>
                              <p className="text-xs text-gray-500">
                                Target: ₹{stock.target_price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rules" className="space-y-4">
                <StockScannerRules
                  rules={screeningRules}
                  onRulesChange={loadScreeningRules}
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIStockScanner;
