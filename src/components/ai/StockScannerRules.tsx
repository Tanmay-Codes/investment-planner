import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit, Trash2, Filter, Settings } from "lucide-react";
import { supabase } from "../../../supabase/supabase";
import { useAuth } from "../../../supabase/auth";
import { Database } from "@/types/supabase";

type ScreeningRule = Database["public"]["Tables"]["screening_rules"]["Row"];

interface StockScannerRulesProps {
  rules: ScreeningRule[];
  onRulesChange: () => void;
}

interface RuleFormData {
  name: string;
  description: string;
  market_cap_min?: number;
  market_cap_max?: number;
  pe_ratio_max?: number;
  pb_ratio_max?: number;
  debt_to_equity_max?: number;
  roe_min?: number;
  revenue_growth_min?: number;
  profit_growth_min?: number;
  dividend_yield_min?: number;
}

const StockScannerRules = ({
  rules = [],
  onRulesChange,
}: StockScannerRulesProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ScreeningRule | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RuleFormData>({
    name: "",
    description: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });
    setEditingRule(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (rule: ScreeningRule) => {
    setEditingRule(rule);
    const ruleData = rule.rules as any;
    setFormData({
      name: rule.name,
      description: rule.description || "",
      market_cap_min: ruleData.market_cap_min,
      market_cap_max: ruleData.market_cap_max,
      pe_ratio_max: ruleData.pe_ratio_max,
      pb_ratio_max: ruleData.pb_ratio_max,
      debt_to_equity_max: ruleData.debt_to_equity_max,
      roe_min: ruleData.roe_min,
      revenue_growth_min: ruleData.revenue_growth_min,
      profit_growth_min: ruleData.profit_growth_min,
      dividend_yield_min: ruleData.dividend_yield_min,
    });
    setIsDialogOpen(true);
  };

  const handleInputChange = (
    field: keyof RuleFormData,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value === "" ? undefined : value,
    }));
  };

  const saveRule = async () => {
    if (!user || !formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please provide a rule name",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const ruleData = {
        name: formData.name,
        description: formData.description,
        user_id: user.id,
        rules: {
          market_cap_min: formData.market_cap_min,
          market_cap_max: formData.market_cap_max,
          pe_ratio_max: formData.pe_ratio_max,
          pb_ratio_max: formData.pb_ratio_max,
          debt_to_equity_max: formData.debt_to_equity_max,
          roe_min: formData.roe_min,
          revenue_growth_min: formData.revenue_growth_min,
          profit_growth_min: formData.profit_growth_min,
          dividend_yield_min: formData.dividend_yield_min,
        },
        is_active: true,
      };

      let error;
      if (editingRule) {
        const { error: updateError } = await supabase
          .from("screening_rules")
          .update(ruleData)
          .eq("id", editingRule.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("screening_rules")
          .insert(ruleData);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: `Rule ${editingRule ? "updated" : "created"} successfully`,
      });

      setIsDialogOpen(false);
      resetForm();
      onRulesChange();
    } catch (error) {
      console.error("Error saving rule:", error);
      toast({
        title: "Error",
        description: "Failed to save rule",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteRule = async (ruleId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("screening_rules")
        .delete()
        .eq("id", ruleId)
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Rule deleted successfully",
      });

      onRulesChange();
    } catch (error) {
      console.error("Error deleting rule:", error);
      toast({
        title: "Error",
        description: "Failed to delete rule",
        variant: "destructive",
      });
    }
  };

  const formatRuleCriteria = (rules: any) => {
    const criteria = [];
    if (rules.market_cap_min)
      criteria.push(`Min Cap: ₹${(rules.market_cap_min / 1e9).toFixed(1)}B`);
    if (rules.pe_ratio_max) criteria.push(`P/E < ${rules.pe_ratio_max}`);
    if (rules.roe_min) criteria.push(`ROE > ${rules.roe_min}%`);
    if (rules.revenue_growth_min)
      criteria.push(`Rev Growth > ${rules.revenue_growth_min}%`);
    return criteria.slice(0, 3); // Show only first 3 criteria
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="h-6 w-6 text-blue-600" />
            Screening Rules Management
          </h2>
          <p className="text-gray-600 mt-1">
            Create and manage custom screening rules for stock analysis
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openCreateDialog}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRule
                  ? "Edit Screening Rule"
                  : "Create New Screening Rule"}
              </DialogTitle>
              <DialogDescription>
                Define criteria to filter stocks based on fundamental and
                technical indicators.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="name">Rule Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., High Growth Stocks"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Describe what this rule is designed to find..."
                    rows={2}
                  />
                </div>
              </div>

              {/* Market Cap Filters */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  Market Cap Filters
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="market_cap_min">
                      Minimum Market Cap (₹)
                    </Label>
                    <Input
                      id="market_cap_min"
                      type="number"
                      value={formData.market_cap_min || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "market_cap_min",
                          Number(e.target.value),
                        )
                      }
                      placeholder="e.g., 1000000000 (1B)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="market_cap_max">
                      Maximum Market Cap (₹)
                    </Label>
                    <Input
                      id="market_cap_max"
                      type="number"
                      value={formData.market_cap_max || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "market_cap_max",
                          Number(e.target.value),
                        )
                      }
                      placeholder="e.g., 100000000000 (100B)"
                    />
                  </div>
                </div>
              </div>

              {/* Valuation Filters */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  Valuation Filters
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pe_ratio_max">Maximum P/E Ratio</Label>
                    <Input
                      id="pe_ratio_max"
                      type="number"
                      step="0.1"
                      value={formData.pe_ratio_max || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "pe_ratio_max",
                          Number(e.target.value),
                        )
                      }
                      placeholder="e.g., 25"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pb_ratio_max">Maximum P/B Ratio</Label>
                    <Input
                      id="pb_ratio_max"
                      type="number"
                      step="0.1"
                      value={formData.pb_ratio_max || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "pb_ratio_max",
                          Number(e.target.value),
                        )
                      }
                      placeholder="e.g., 3"
                    />
                  </div>
                </div>
              </div>

              {/* Financial Health */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  Financial Health
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="debt_to_equity_max">
                      Maximum Debt-to-Equity
                    </Label>
                    <Input
                      id="debt_to_equity_max"
                      type="number"
                      step="0.1"
                      value={formData.debt_to_equity_max || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "debt_to_equity_max",
                          Number(e.target.value),
                        )
                      }
                      placeholder="e.g., 0.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="roe_min">Minimum ROE (%)</Label>
                    <Input
                      id="roe_min"
                      type="number"
                      step="0.1"
                      value={formData.roe_min || ""}
                      onChange={(e) =>
                        handleInputChange("roe_min", Number(e.target.value))
                      }
                      placeholder="e.g., 15"
                    />
                  </div>
                </div>
              </div>

              {/* Growth Filters */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  Growth Filters
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="revenue_growth_min">
                      Min Revenue Growth (%)
                    </Label>
                    <Input
                      id="revenue_growth_min"
                      type="number"
                      step="0.1"
                      value={formData.revenue_growth_min || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "revenue_growth_min",
                          Number(e.target.value),
                        )
                      }
                      placeholder="e.g., 10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="profit_growth_min">
                      Min Profit Growth (%)
                    </Label>
                    <Input
                      id="profit_growth_min"
                      type="number"
                      step="0.1"
                      value={formData.profit_growth_min || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "profit_growth_min",
                          Number(e.target.value),
                        )
                      }
                      placeholder="e.g., 15"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dividend_yield_min">
                      Min Dividend Yield (%)
                    </Label>
                    <Input
                      id="dividend_yield_min"
                      type="number"
                      step="0.1"
                      value={formData.dividend_yield_min || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "dividend_yield_min",
                          Number(e.target.value),
                        )
                      }
                      placeholder="e.g., 2"
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveRule} disabled={loading}>
                {loading
                  ? "Saving..."
                  : editingRule
                    ? "Update Rule"
                    : "Create Rule"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rules List */}
      <div className="grid gap-4">
        {rules.length === 0 ? (
          <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Filter className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Screening Rules
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Create your first screening rule to start finding investment
                opportunities
              </p>
              <Button
                onClick={openCreateDialog}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Rule
              </Button>
            </CardContent>
          </Card>
        ) : (
          rules.map((rule) => (
            <Card
              key={rule.id}
              className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5 text-blue-600" />
                      {rule.name}
                    </CardTitle>
                    <p className="text-gray-600 mt-1">{rule.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={rule.is_active ? "default" : "secondary"}>
                      {rule.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(rule)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {rule.user_id && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteRule(rule.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {formatRuleCriteria(rule.rules).map((criteria, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {criteria}
                    </Badge>
                  ))}
                  {formatRuleCriteria(rule.rules).length === 0 && (
                    <span className="text-gray-500 text-sm">
                      No criteria defined
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default StockScannerRules;
