import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronRight, Settings, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";

export default function LandingPage() {
  const { user, signOut } = useAuth();

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/30">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center">
            <Link to="/" className="font-bold text-2xl text-blue-600">
              Tanmay Wealth Tracker
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    className="text-sm font-medium hover:text-blue-600"
                  >
                    Portfolio Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-9 w-9 hover:cursor-pointer border-2 border-blue-100">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                        alt={user.email || ""}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-xl border-none shadow-lg"
                  >
                    <DropdownMenuLabel className="text-xs text-gray-500">
                      {user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={() => signOut()}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-sm font-medium hover:text-blue-600"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm px-6 py-2 font-medium">
                    Start Investing
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero section */}
        <section className="py-24 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl transform -translate-y-12 scale-150"></div>
          <div className="relative z-10 max-w-4xl mx-auto px-6">
            <h1 className="text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI-Powered Investment Management
            </h1>
            <h2 className="text-2xl font-medium text-gray-600 mb-8 max-w-3xl mx-auto">
              Take control of your wealth with intelligent portfolio insights,
              AI-driven stock analysis, and automated investment strategies.
            </h2>
            <div className="flex justify-center space-x-6 text-lg">
              {user ? (
                <Link to="/dashboard">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all">
                    View Portfolio <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/signup">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all">
                      Start Investing <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button
                      variant="outline"
                      className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full text-lg font-medium"
                    >
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="py-24 bg-white text-center">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-5xl font-bold tracking-tight mb-4">
              Intelligent Investment Features
            </h2>
            <h3 className="text-xl font-medium text-gray-600 mb-16 max-w-3xl mx-auto">
              Everything you need to make smarter investment decisions with
              AI-powered insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-3xl text-left group hover:shadow-xl transition-all duration-300">
                <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-900">
                  Portfolio Dashboard
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  Track your investment buckets with visual charts and
                  performance comparison against NIFTY50.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-3xl text-left group hover:shadow-xl transition-all duration-300">
                <div className="h-14 w-14 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-900">
                  AI Stock Scanner
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  Gemini-powered analysis with technical indicators and 10-rule
                  checklist scoring system.
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-3xl text-left group hover:shadow-xl transition-all duration-300">
                <div className="h-14 w-14 bg-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-900">
                  Allocation Tracker
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  Monitor target allocations with alerts when your portfolio
                  deviates from strategy.
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-3xl text-left group hover:shadow-xl transition-all duration-300">
                <div className="h-14 w-14 bg-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-900">
                  Cash Flow Planner
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  Allocate monthly investments based on income, expenses, and
                  investment strategy.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI & Analytics Section */}
        <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold tracking-tight mb-6">
                  AI-Powered Investment Intelligence
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Leverage Google Gemini AI to analyze financial news, technical
                  indicators, and market trends. Get comprehensive stock
                  analysis with our proprietary 10-rule checklist scoring
                  system.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">
                      Real-time financial news analysis
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">
                      Technical indicator evaluation
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">
                      10-rule investment checklist
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">
                      Historical analysis storage
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-xl">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl text-white mb-6">
                  <h3 className="text-lg font-semibold mb-2">
                    AI Stock Analysis
                  </h3>
                  <div className="text-sm opacity-90">
                    RELIANCE.NS • ₹2,847.50 (+2.3%)
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Technical Score</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div className="w-16 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-green-600 font-semibold">8/10</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">News Sentiment</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div className="w-14 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <span className="text-blue-600 font-semibold">7/10</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Overall Rating</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div className="w-18 h-2 bg-purple-500 rounded-full"></div>
                      </div>
                      <span className="text-purple-600 font-semibold">
                        9/10
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Management Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-3xl">
                <h3 className="text-2xl font-bold mb-6 text-center">
                  Investment Allocation
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 font-medium">ETFs</span>
                      <span className="text-blue-600 font-semibold">60%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 font-medium">
                        Alpha Stocks
                      </span>
                      <span className="text-purple-600 font-semibold">30%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-purple-600 h-3 rounded-full"
                        style={{ width: "30%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 font-medium">Cash</span>
                      <span className="text-green-600 font-semibold">10%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-600 h-3 rounded-full"
                        style={{ width: "10%" }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-white rounded-xl">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      ₹12,45,000
                    </div>
                    <div className="text-sm text-gray-500">
                      Total Portfolio Value
                    </div>
                    <div className="text-green-600 font-medium mt-1">
                      +15.2% vs NIFTY50
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-4xl font-bold tracking-tight mb-6">
                  Smart Portfolio Management
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Monitor your investment buckets with intelligent allocation
                  tracking. Get alerts when your portfolio deviates from your
                  target strategy and receive automated rebalancing suggestions.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                    <span className="text-gray-700">
                      Automated allocation monitoring
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                    <span className="text-gray-700">
                      NIFTY50 performance comparison
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                    <span className="text-gray-700">
                      Rebalancing alerts & suggestions
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                    <span className="text-gray-700">
                      Monthly investment planning
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Investment Strategy?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of investors who are already using AI to make smarter
            investment decisions.
          </p>
          {user ? (
            <Link to="/dashboard">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold shadow-lg">
                Access Your Dashboard <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Link to="/signup">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold shadow-lg">
                Start Your Investment Journey{" "}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg text-white mb-4">
                Tanmay Wealth Tracker
              </h4>
              <p className="text-sm leading-relaxed">
                AI-powered investment management platform for smarter financial
                decisions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Features</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Portfolio Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    AI Stock Scanner
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Allocation Tracker
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Cash Flow Planner
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Investment Guide
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Market Analysis
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    API Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Risk Disclosure
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>
              &copy; 2025 Tanmay Wealth Tracker. All rights reserved. Investment
              advice is subject to market risks.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
