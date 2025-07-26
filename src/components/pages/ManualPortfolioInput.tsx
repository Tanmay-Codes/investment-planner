import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import PortfolioDataTable from "../dashboard/PortfolioDataTable";
import { supabase } from "../../../supabase/supabase";
import { useAuth } from "../../../supabase/auth";
import { Database } from "@/types/supabase";
import {
  PlusCircle,
  TrendingUp,
  Calendar,
  DollarSign,
  Percent,
  FileText,
} from "lucide-react";

type PortfolioEntry = {
  id: string;
  entry_date: string;
  portfolio_value: number;
  gain_percent: number;
  notes?: string;
  created_at: string;
};

const ManualPortfolioInput = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [portfolioEntries, setPortfolioEntries] = useState<PortfolioEntry[]>(
    [],
  );
  const [formData, setFormData] = useState({
    entry_date: new Date().toISOString().split("T")[0],
    portfolio_value: "",
    gain_percent: "",
    notes: "",
  });

  useEffect(() => {
    if (user) {
      loadPortfolioEntries();
    }
  }, [user]);

  const loadPortfolioEntries = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("portfolio_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("entry_date", { ascending: false });

      if (error) throw error;
      setPortfolioEntries(data || []);
    } catch (error) {
      console.error("Error loading portfolio entries:", error);
      toast({
        title: "Error",
        description: "Failed to load portfolio entries",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.portfolio_value || !formData.gain_percent) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("portfolio_entries").insert({
        user_id: user.id,
        entry_date: formData.entry_date,
        portfolio_value: parseFloat(formData.portfolio_value),
        gain_percent: parseFloat(formData.gain_percent),
        notes: formData.notes || null,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Portfolio entry added successfully",
      });

      // Reset form
      setFormData({
        entry_date: new Date().toISOString().split("T")[0],
        portfolio_value: "",
        gain_percent: "",
        notes: "",
      });

      // Reload entries
      loadPortfolioEntries();
    } catch (error) {
      console.error("Error adding portfolio entry:", error);
      toast({
        title: "Error",
        description: "Failed to add portfolio entry",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar activeItem="Portfolio Input" />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                  Manual Portfolio Input
                </h1>
                <p className="text-gray-600 mt-1">
                  Track your portfolio performance by manually entering values
                  from your Zerodha account
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Form */}
              <div className="lg:col-span-1">
                <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PlusCircle className="h-5 w-5 text-blue-600" />
                      Add Portfolio Entry
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="entry_date"
                          className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                          <Calendar className="h-4 w-4" />
                          Date
                        </Label>
                        <Input
                          id="entry_date"
                          type="date"
                          value={formData.entry_date}
                          onChange={(e) =>
                            handleInputChange("entry_date", e.target.value)
                          }
                          className="w-full"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="portfolio_value"
                          className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                          <DollarSign className="h-4 w-4" />
                          Portfolio Value (₹)
                        </Label>
                        <Input
                          id="portfolio_value"
                          type="number"
                          step="0.01"
                          placeholder="450000"
                          value={formData.portfolio_value}
                          onChange={(e) =>
                            handleInputChange("portfolio_value", e.target.value)
                          }
                          className="w-full"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="gain_percent"
                          className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                          <Percent className="h-4 w-4" />
                          Gain/Loss (%)
                        </Label>
                        <Input
                          id="gain_percent"
                          type="number"
                          step="0.01"
                          placeholder="2.5"
                          value={formData.gain_percent}
                          onChange={(e) =>
                            handleInputChange("gain_percent", e.target.value)
                          }
                          className="w-full"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="notes"
                          className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          Notes (Optional)
                        </Label>
                        <Textarea
                          id="notes"
                          placeholder="Any additional notes about this entry..."
                          value={formData.notes}
                          onChange={(e) =>
                            handleInputChange("notes", e.target.value)
                          }
                          className="w-full min-h-[80px]"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {loading ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Adding Entry...
                          </>
                        ) : (
                          <>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Entry
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Portfolio Data Table */}
              <div className="lg:col-span-2">
                <PortfolioDataTable
                  entries={portfolioEntries}
                  onRefresh={loadPortfolioEntries}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManualPortfolioInput;
