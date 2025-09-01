import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import StatCard from "@/components/StatCard";
import { 
  Shield, 
  Coins, 
  Gift, 
  QrCode, 
  MapPin, 
  Calendar,
  Heart,
  GraduationCap,
  Utensils,
  ArrowUpRight
} from "lucide-react";

const Dashboard = () => {
  const [userType] = useState<"beneficiary" | "ngo">("beneficiary");
  
  // Mock data for beneficiary dashboard
  const beneficiaryData = {
    digitalId: "SID-A7X9K2M5P",
    name: "Maria Santos",
    location: "São Paulo, Brazil",
    memberSince: "March 2024",
    totalAidReceived: 450,
    activeTokens: 125,
    pendingAid: 75,
    recentTransactions: [
      { id: 1, type: "Food Voucher", amount: 50, date: "2024-01-15", status: "completed" },
      { id: 2, type: "Education Grant", amount: 200, date: "2024-01-10", status: "completed" },
      { id: 3, type: "Healthcare Credit", amount: 100, date: "2024-01-08", status: "completed" },
    ]
  };

  const aidCategories = [
    { name: "Food & Nutrition", balance: 45, icon: Utensils, color: "text-accent" },
    { name: "Education", balance: 80, icon: GraduationCap, color: "text-primary" },
    { name: "Healthcare", balance: 0, icon: Heart, color: "text-muted-foreground" },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome back, {beneficiaryData.name}</h1>
              <p className="text-muted-foreground">Manage your digital identity and aid balance</p>
            </div>
            <Button variant="outline" className="gap-2">
              <QrCode className="h-4 w-4" />
              Show ID
            </Button>
          </div>
          
          {/* Identity Card */}
          <Card className="shadow-medium border-0 bg-gradient-primary text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Digital Identity</h2>
                    <p className="text-white/90 font-mono text-sm">{beneficiaryData.digitalId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    Verified ✓
                  </Badge>
                  <div className="flex items-center text-white/90 text-sm mt-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {beneficiaryData.location}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Aid Received"
            value={`$${beneficiaryData.totalAidReceived}`}
            description="Lifetime aid value"
            icon={Gift}
            variant="accent"
          />
          <StatCard
            title="Active Tokens"
            value={beneficiaryData.activeTokens.toString()}
            description="Available for redemption"
            icon={Coins}
            variant="default"
          />
          <StatCard
            title="Pending Aid"
            value={`$${beneficiaryData.pendingAid}`}
            description="Being processed"
            icon={Calendar}
            variant="success"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Aid Categories */}
          <div className="lg:col-span-2">
            <Card className="shadow-soft border-0">
              <CardHeader>
                <CardTitle>Aid Categories</CardTitle>
                <CardDescription>Your current balance across different aid types</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {aidCategories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <category.icon className={`h-5 w-5 ${category.color}`} />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="text-sm font-medium">${category.balance}</span>
                    </div>
                    <Progress value={(category.balance / 100) * 100} className="h-2" />
                  </div>
                ))}
                
                <Button className="w-full mt-6" variant="accent">
                  <Gift className="h-4 w-4 mr-2" />
                  Redeem Aid Tokens
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="shadow-soft border-0">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest aid transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {beneficiaryData.recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{transaction.type}</p>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">${transaction.amount}</p>
                        <Badge variant="outline" className="text-xs">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="ghost" className="w-full mt-4 text-primary">
                  View All Transactions
                  <ArrowUpRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;