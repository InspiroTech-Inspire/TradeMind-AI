import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex-1 p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">TradeMind AI Dashboard</h1>
        <p className="text-muted-foreground">AI-powered trading analysis</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Your trading analysis platform</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Application is working!</p>
          <Button onClick={() => setCount(count + 1)}>
            Test: {count}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}