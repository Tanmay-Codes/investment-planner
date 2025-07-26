import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  LayoutDashboard,
  PieChart,
  Brain,
  Target,
  DollarSign,
  Settings,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  isActive?: boolean;
}

interface SidebarProps {
  items?: NavItem[];
  activeItem?: string;
  onItemClick?: (label: string) => void;
}

const defaultNavItems: NavItem[] = [
  {
    icon: <Home size={20} />,
    label: "Portfolio Overview",
    isActive: true,
    href: "/dashboard",
  },
  {
    icon: <Brain size={20} />,
    label: "AI Stock Scanner",
    href: "/ai-stock-scanner",
  },
  { icon: <Target size={20} />, label: "Allocation Tracker" },
  { icon: <DollarSign size={20} />, label: "Cash Flow Planner" },
  { icon: <TrendingUp size={20} />, label: "Performance" },
];

const defaultBottomItems: NavItem[] = [
  { icon: <Settings size={20} />, label: "Settings" },
  { icon: <HelpCircle size={20} />, label: "Help" },
];

const Sidebar = ({
  items = defaultNavItems,
  activeItem = "Home",
  onItemClick = () => {},
}: SidebarProps) => {
  return (
    <div className="w-[280px] h-full bg-white/80 backdrop-blur-md border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-900">
          Tanmay Wealth
        </h2>
        <p className="text-sm text-gray-500">
          AI-Powered Investment Management
        </p>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-1.5">
          {items.map((item) => {
            const ButtonComponent = item.href ? Link : Button;
            const buttonProps = item.href
              ? { to: item.href }
              : { onClick: () => onItemClick(item.label) };

            return (
              <ButtonComponent
                key={item.label}
                {...buttonProps}
                className={`w-full justify-start gap-3 h-10 rounded-xl text-sm font-medium flex items-center ${item.label === activeItem ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : "text-gray-700 hover:bg-gray-100"} ${item.href ? "no-underline" : ""}`}
              >
                <span
                  className={`${item.label === activeItem ? "text-blue-600" : "text-gray-500"}`}
                >
                  {item.icon}
                </span>
                {item.label}
              </ButtonComponent>
            );
          })}
        </div>

        <Separator className="my-4 bg-gray-100" />

        <div className="space-y-3">
          <h3 className="text-xs font-medium px-4 py-1 text-gray-500 uppercase tracking-wider">
            Investment Buckets
          </h3>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-9 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
            ETFs (60%)
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-9 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            Alpha Stocks (30%)
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-9 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
            Cash (10%)
          </Button>
        </div>
      </ScrollArea>

      <div className="p-4 mt-auto border-t border-gray-200">
        {defaultBottomItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className="w-full justify-start gap-3 h-10 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 mb-1.5"
            onClick={() => onItemClick(item.label)}
          >
            <span className="text-gray-500">{item.icon}</span>
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
