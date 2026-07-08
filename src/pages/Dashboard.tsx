import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { AnalysisScoreCard } from "@/components/AnalysisScoreCard";
import { TradingViewChart } from "@/components/TradingViewChart";
import { IndicatorPanel } from "@/components/IndicatorPanel";
import { PatternPanel } from "@/components/PatternPanel";
import { TopDownPanel } from "@/components/TopDownPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SymbolSearch } from "@/components/SymbolSearch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Dashboard() {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  const [selectedTimeframe, setSelectedTimeframe] = useState<"1d" | "4h" | "1h" | "30m" | "15m" | "5m">("1d");
  const [showSymbolSearch, setShowSymbolSearch] = useState(false);
  
  const { data: analysisData, isLoading, error } = trpc.analysis.analyze.useQuery({
    symbol: selectedSymbol,
    timeframe: selectedTimeframe,
  });

  const handleSymbolSelect = (symbol: string) => {
    setSelectedSymbol(symbol);
    setShowSymbolSearch(false);
  };

  const getChangeColor = (value: number | undefined) => {
    if (value === undefined) return "text-muted-foreground";
    return value > 0 ? "text-green-500" : "text-red-500";
  };

  const formatSignal = (signal: string | undefined) => {
    if (!signal) return "Neutral";
    return signal.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            AI-powered trading analysis and insights
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setShowSymbolSearch(true)}>
            Search Symbol
          </Button>
          <Button variant="outline" size="sm">
            Scan Market
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error.message}</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="technical">Technical Analysis</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="topdown">Top-Down</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <AnalysisScoreCard
              label="Overall"
              score={analysisData?.scores.overall || 0}
              icon={null as any}
              highlight
            />
            <AnalysisScoreCard
              label="Trend"
              score={analysisData?.scores.trend || 0}
              icon={null as any}
            />
            <AnalysisScoreCard
              label="Momentum"
              score={analysisData?.scores.momentum || 0}
              icon={null as any}
            />
            <AnalysisScoreCard
              label="Volume"
              score={analysisData?.scores.volume || 0}
              icon={null as any}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{selectedSymbol} Chart</CardTitle>
                <CardDescription>
                  Real-time price data and technical indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe as any}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1d">Daily</SelectItem>
                      <SelectItem value="4h">4 Hours</SelectItem>
                      <SelectItem value="1h">1 Hour</SelectItem>
                      <SelectItem value="30m">30 Minutes</SelectItem>
                      <SelectItem value="15m">15 Minutes</SelectItem>
                      <SelectItem value="5m">5 Minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="h-[400px]">
                  <TradingViewChart
                    symbol={selectedSymbol}
                    timeframe={selectedTimeframe}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analysis Summary</CardTitle>
                <CardDescription>
                  AI-generated trading insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Signal</p>
                    <p className="text-2xl font-bold capitalized">
                      {formatSignal(analysisData?.signal)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Price</p>
                    <p className="text-xl font-semibold">
                      ${analysisData?.price?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Change</p>
                      <p className={getChangeColor(analysisData?.change)}>
                        {analysisData?.change?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Change %</p>
                      <p className={getChangeColor(analysisData?.changePercent)}>
                        {analysisData?.changePercent?.toFixed(2) || "0.00"}%
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Analyzed</p>
                    <p className="text-sm">
                      {analysisData?.analyzedAt ? new Date(analysisData.analyzedAt).toLocaleString() : "Never"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="technical">
          <IndicatorPanel analysis={analysisData} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="patterns">
          <PatternPanel analysis={analysisData} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="topdown">
          <TopDownPanel symbol={selectedSymbol} />
        </TabsContent>
      </Tabs>
      
      {showSymbolSearch && (
        <SymbolSearch onClose={() => setShowSymbolSearch(false)} onSelect={handleSymbolSelect} />
      )}
    </div>
  );
}