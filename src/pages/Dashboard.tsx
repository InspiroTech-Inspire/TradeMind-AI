import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  
  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">TradeMind AI Dashboard</h1>
          <p className="text-muted-foreground">
            AI-powered trading analysis and insights
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome to TradeMind AI</CardTitle>
          <CardDescription>
            Your intelligent trading analysis platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This dashboard will provide comprehensive trading analysis with multi-timeframe support.
          </p>
          <Button className="mt-4" onClick={() => setSelectedSymbol("AAPL")}>
            Test Button: {selectedSymbol}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}