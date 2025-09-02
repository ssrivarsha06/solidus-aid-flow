import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Building, 
  Coins, 
  TrendingUp, 
  UserPlus, 
  Search, 
  Filter,
  LogOut,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  PieChart,
  BarChart3,
  Activity,
  ExternalLink
} from "lucide-react";
import StatCard from "@/components/StatCard";

// Mock data for demo purposes
const mockBeneficiaries = [
  { id: "0x1a2b", name: "Alice Johnson", verification: "verified", aidReceived: 850, location: "District A" },
  { id: "0x2c3d", name: "Bob Wilson", verification: "pending", aidReceived: 0, location: "District B" },
  { id: "0x3e4f", name: "Carol Smith", verification: "verified", aidReceived: 1200, location: "District A" },
  { id: "0x4g5h", name: "David Brown", verification: "suspended", aidReceived: 600, location: "District C" },
];

const mockVendors = [
  { id: "0x5i6j", name: "Village Store A", wallet: "0x789abc", redemptions: 4500, status: "active" },
  { id: "0x6k7l", name: "Medical Center B", wallet: "0x456def", redemptions: 2800, status: "active" },
  { id: "0x7m8n", name: "Food Market C", wallet: "0x123ghi", redemptions: 6200, status: "inactive" },
];

const mockTransactions = [
  { type: "Aid Allocation", user: "Alice Johnson", amount: 250, date: "2024-01-15", hash: "0xabc123" },
  { type: "Aid Redemption", user: "Bob Wilson", amount: 150, date: "2024-01-14", hash: "0xdef456" },
  { type: "Vendor Payment", user: "Village Store A", amount: 800, date: "2024-01-13", hash: "0xghi789" },
];

const NGODashboard = () => {
  const { toast } = useToast();
  const [ngoSession, setNgoSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [aidAllocationForm, setAidAllocationForm] = useState({
    beneficiaryId: "",
    amount: "",
    category: ""
  });

  useEffect(() => {
    const session = sessionStorage.getItem('ngoSession');
    if (session) {
      setNgoSession(JSON.parse(session));
    } else {
      // Redirect if not authenticated
      window.location.href = "/ngo-login";
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('ngoSession');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    window.location.href = "/ngo-login";
  };

  const handleAidAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Aid Allocated Successfully",
      description: `${aidAllocationForm.amount} tokens allocated to beneficiary.`,
    });
    setAidAllocationForm({ beneficiaryId: "", amount: "", category: "" });
  };

  if (!ngoSession) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">NGO Dashboard</h1>
              <p className="text-muted-foreground">Welcome, {ngoSession.organizationName}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="allocation">Aid Allocation</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Aid Distributed"
                value="$125,430"
                description="+12% from last month"
                icon={Coins}
                variant="success"
              />
              <StatCard
                title="Total Beneficiaries"
                value="1,247"
                description="89 added this week"
                icon={Users}
                variant="default"
              />
              <StatCard
                title="Active Vendors"
                value="23"
                description="3 new partnerships"
                icon={Building}
                variant="accent"
              />
              <StatCard
                title="Current Balance"
                value="$45,200"
                description="Available for allocation"
                icon={TrendingUp}
                variant="default"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest aid allocations and redemptions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTransactions.slice(0, 5).map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{transaction.type}</p>
                          <p className="text-sm text-muted-foreground">{transaction.user}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${transaction.amount}</p>
                          <p className="text-sm text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common dashboard actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Register New Beneficiary
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Coins className="mr-2 h-4 w-4" />
                    Allocate Aid Tokens
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Building className="mr-2 h-4 w-4" />
                    Add New Vendor
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Beneficiaries Tab */}
          <TabsContent value="beneficiaries" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Beneficiary Management</h2>
                <p className="text-muted-foreground">Manage and track all registered beneficiaries</p>
              </div>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Beneficiary
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search beneficiaries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Hash</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Verification</TableHead>
                      <TableHead>Aid Received</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBeneficiaries.map((beneficiary) => (
                      <TableRow key={beneficiary.id}>
                        <TableCell className="font-mono">{beneficiary.id}</TableCell>
                        <TableCell>{beneficiary.name}</TableCell>
                        <TableCell>{beneficiary.location}</TableCell>
                        <TableCell>
                          <Badge variant={
                            beneficiary.verification === "verified" ? "default" :
                            beneficiary.verification === "pending" ? "secondary" : "destructive"
                          }>
                            {beneficiary.verification}
                          </Badge>
                        </TableCell>
                        <TableCell>${beneficiary.aidReceived}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Ban className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vendors Tab */}
          <TabsContent value="vendors" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Vendor Management</h2>
                <p className="text-muted-foreground">Manage aid redemption partners</p>
              </div>
              <Button>
                <Building className="mr-2 h-4 w-4" />
                Add Vendor
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor Name</TableHead>
                      <TableHead>Wallet Address</TableHead>
                      <TableHead>Total Redemptions</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockVendors.map((vendor) => (
                      <TableRow key={vendor.id}>
                        <TableCell>{vendor.name}</TableCell>
                        <TableCell className="font-mono">{vendor.wallet}</TableCell>
                        <TableCell>${vendor.redemptions}</TableCell>
                        <TableCell>
                          <Badge variant={vendor.status === "active" ? "default" : "secondary"}>
                            {vendor.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              {vendor.status === "active" ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aid Allocation Tab */}
          <TabsContent value="allocation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Allocate Aid Tokens</CardTitle>
                  <CardDescription>Distribute aid to verified beneficiaries</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAidAllocation} className="space-y-4">
                    <div>
                      <Label htmlFor="beneficiary">Select Beneficiary</Label>
                      <Select value={aidAllocationForm.beneficiaryId} onValueChange={(value) => setAidAllocationForm(prev => ({ ...prev, beneficiaryId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose beneficiary" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockBeneficiaries.filter(b => b.verification === "verified").map((beneficiary) => (
                            <SelectItem key={beneficiary.id} value={beneficiary.id}>
                              {beneficiary.name} ({beneficiary.id})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="amount">Amount (USD)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={aidAllocationForm.amount}
                        onChange={(e) => setAidAllocationForm(prev => ({ ...prev, amount: e.target.value }))}
                        placeholder="Enter amount"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Aid Category</Label>
                      <Select value={aidAllocationForm.category} onValueChange={(value) => setAidAllocationForm(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="food">Food Assistance</SelectItem>
                          <SelectItem value="health">Healthcare</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="emergency">Emergency Relief</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={!aidAllocationForm.beneficiaryId || !aidAllocationForm.amount || !aidAllocationForm.category}>
                      <Coins className="mr-2 h-4 w-4" />
                      Allocate Aid
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Allocations</CardTitle>
                  <CardDescription>Latest aid distribution history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTransactions.filter(t => t.type === "Aid Allocation").map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{transaction.user}</p>
                          <p className="text-sm text-muted-foreground">{transaction.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${transaction.amount}</p>
                          <p className="text-sm text-muted-foreground">Allocated</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
              <p className="text-muted-foreground">Visual insights into aid distribution</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribution Trends</CardTitle>
                  <CardDescription>Aid distribution over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Chart visualization would appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Aid Categories</CardTitle>
                  <CardDescription>Distribution by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Pie chart would appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Impact Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">89%</div>
                    <p className="text-sm text-muted-foreground">Beneficiary Satisfaction</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">95%</div>
                    <p className="text-sm text-muted-foreground">Aid Redemption Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">12.5s</div>
                    <p className="text-sm text-muted-foreground">Avg. Transaction Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Trail Tab */}
          <TabsContent value="audit" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Audit Trail</h2>
              <p className="text-muted-foreground">Blockchain transaction history and transparency</p>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction Type</TableHead>
                      <TableHead>User/Entity</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Transaction Hash</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTransactions.map((transaction, index) => (
                      <TableRow key={index}>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell>{transaction.user}</TableCell>
                        <TableCell>${transaction.amount}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell className="font-mono">{transaction.hash}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NGODashboard;