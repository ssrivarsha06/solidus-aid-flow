import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  ExternalLink,
  User,
  Plus
} from "lucide-react";
import StatCard from "@/components/StatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart as RechartsPieChart, Cell, ResponsiveContainer, Pie } from 'recharts';

// Chart data
const chartData = [
  { month: 'Jan', food: 4000, health: 2400, education: 2400 },
  { month: 'Feb', food: 3000, health: 1398, education: 2210 },
  { month: 'Mar', food: 2000, health: 9800, education: 2290 },
  { month: 'Apr', food: 2780, health: 3908, education: 2000 },
  { month: 'May', food: 1890, health: 4800, education: 2181 },
  { month: 'Jun', food: 2390, health: 3800, education: 2500 },
];

const pieData = [
  { name: 'Food & Nutrition', value: 400, color: '#0088FE' },
  { name: 'Healthcare', value: 300, color: '#00C49F' },
  { name: 'Education', value: 300, color: '#FFBB28' },
  { name: 'Emergency', value: 200, color: '#FF8042' },
];

// Get beneficiaries from session storage or use mock data
const getBeneficiaries = () => {
  const allUsers = JSON.parse(sessionStorage.getItem('allUsers') || '[]');
  const registeredUsers = allUsers.map((user: any) => ({
    id: user.digitalId,
    name: `${user.firstName} ${user.lastName}`,
    verification: user.isVerified ? "verified" : "pending",
    aidReceived: user.aidBalance || 0,
    location: user.location,
    hasPhoto: user.hasPhoto,
    biometricPhoto: user.biometricPhoto,
    verificationMethod: user.verificationMethod,
    status: user.isVerified ? "verified" : "pending"
  }));
  
  // Add mock data if needed
  const mockBeneficiaries = [
    { id: "0x1a2b", name: "Alice Johnson", verification: "verified", aidReceived: 850, location: "District A", hasPhoto: false, status: "verified" },
    { id: "0x2c3d", name: "Bob Wilson", verification: "pending", aidReceived: 0, location: "District B", hasPhoto: false, status: "pending" },
    { id: "0x3e4f", name: "Carol Smith", verification: "verified", aidReceived: 1200, location: "District A", hasPhoto: false, status: "verified" },
    { id: "0x4g5h", name: "David Brown", verification: "suspended", aidReceived: 600, location: "District C", hasPhoto: false, status: "suspended" },
  ];
  
  return [...registeredUsers, ...mockBeneficiaries];
};

// Get NGO data from session storage
const getNGOData = () => {
  const ngoData = JSON.parse(sessionStorage.getItem('ngoData') || '{}');
  return {
    totalAidDistributed: ngoData.totalAidDistributed || 125430,
    totalBeneficiaries: ngoData.totalBeneficiaries || getBeneficiaries().length,
    activeVendors: ngoData.activeVendors || 23,
    currentBalance: ngoData.currentBalance || 45200,
    recentActivity: ngoData.recentActivity || []
  };
};

// Save NGO data to session storage
const saveNGOData = (data: any) => {
  sessionStorage.setItem('ngoData', JSON.stringify(data));
};

// Get vendors from session storage
const getVendors = () => {
  const vendors = JSON.parse(sessionStorage.getItem('vendors') || '[]');
  const defaultVendors = [
    { id: "0x5i6j", name: "Village Store A", wallet: "0x789abc", redemptions: 4500, status: "active" },
    { id: "0x6k7l", name: "Medical Center B", wallet: "0x456def", redemptions: 2800, status: "active" },
    { id: "0x7m8n", name: "Food Market C", wallet: "0x123ghi", redemptions: 6200, status: "inactive" },
  ];
  return vendors.length > 0 ? vendors : defaultVendors;
};

// Get transactions from session storage
const getTransactions = () => {
  const transactions = JSON.parse(sessionStorage.getItem('ngoTransactions') || '[]');
  const defaultTransactions = [
    { type: "Aid Allocation", user: "Alice Johnson", amount: 250, date: "2024-01-15", hash: "0xabc123", id: "1" },
    { type: "Aid Redemption", user: "Bob Wilson", amount: 150, date: "2024-01-14", hash: "0xdef456", id: "2" },
    { type: "Vendor Payment", user: "Village Store A", amount: 800, date: "2024-01-13", hash: "0xghi789", id: "3" },
  ];
  return transactions.length > 0 ? transactions : defaultTransactions;
};

// Save transaction to session storage
const saveTransaction = (transaction: any) => {
  const transactions = getTransactions();
  const newTransaction = {
    ...transaction,
    id: Date.now().toString(),
    hash: `0x${Math.random().toString(16).substr(2, 8)}`
  };
  transactions.unshift(newTransaction);
  sessionStorage.setItem('ngoTransactions', JSON.stringify(transactions));
  return newTransaction;
};

const NGODashboard = () => {
  const { toast } = useToast();
  const [ngoSession, setNgoSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [beneficiaries, setBeneficiaries] = useState(getBeneficiaries());
  const [vendors, setVendors] = useState(getVendors());
  const [transactions, setTransactions] = useState(getTransactions());
  const [ngoData, setNgoData] = useState(getNGOData());
  const [showBeneficiaryDialog, setShowBeneficiaryDialog] = useState(false);
  const [showVendorDialog, setShowVendorDialog] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<any>(null);
  const [newBeneficiary, setNewBeneficiary] = useState({
    name: "",
    location: "",
    emergencyContact: ""
  });
  const [newVendor, setNewVendor] = useState({
    name: "",
    wallet: "",
    category: ""
  });
  const [aidAllocationForm, setAidAllocationForm] = useState({
    beneficiaryId: "",
    amount: "",
    category: ""
  });

  // Refresh data when component mounts or updates
  useEffect(() => {
    setBeneficiaries(getBeneficiaries());
    setVendors(getVendors());
    setTransactions(getTransactions());
    setNgoData(getNGOData());
  }, []);

  useEffect(() => {
    const session = sessionStorage.getItem('ngoSession');
    if (session) {
      setNgoSession(JSON.parse(session));
    } else {
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

  const updateNGOStats = (updates: any) => {
    const updatedData = { ...ngoData, ...updates };
    setNgoData(updatedData);
    saveNGOData(updatedData);
  };

  const handleRegisterBeneficiary = () => {
    if (!newBeneficiary.name || !newBeneficiary.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const beneficiary = {
      id: `0x${Math.random().toString(16).substr(2, 8)}`,
      name: newBeneficiary.name,
      verification: "pending",
      aidReceived: 0,
      location: newBeneficiary.location,
      hasPhoto: false,
      status: "pending",
      emergencyContact: newBeneficiary.emergencyContact
    };

    const updatedBeneficiaries = [...beneficiaries, beneficiary];
    setBeneficiaries(updatedBeneficiaries);
    
    // Update NGO stats
    updateNGOStats({
      totalBeneficiaries: updatedBeneficiaries.length
    });

    // Save recent activity
    const activity = {
      type: "Beneficiary Registration",
      user: beneficiary.name,
      amount: 0,
      date: new Date().toISOString().split('T')[0]
    };
    saveTransaction(activity);
    setTransactions(getTransactions());

    toast({
      title: "Beneficiary Registered",
      description: `${beneficiary.name} has been registered successfully.`,
    });

    setNewBeneficiary({ name: "", location: "", emergencyContact: "" });
    setShowBeneficiaryDialog(false);
  };

  const handleAddVendor = () => {
    if (!newVendor.name || !newVendor.wallet) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const vendor = {
      id: `0x${Math.random().toString(16).substr(2, 8)}`,
      name: newVendor.name,
      wallet: newVendor.wallet,
      redemptions: 0,
      status: "active",
      category: newVendor.category
    };

    const updatedVendors = [...vendors, vendor];
    setVendors(updatedVendors);
    sessionStorage.setItem('vendors', JSON.stringify(updatedVendors));

    // Update NGO stats
    updateNGOStats({
      activeVendors: updatedVendors.filter(v => v.status === "active").length
    });

    toast({
      title: "Vendor Added",
      description: `${vendor.name} has been added successfully.`,
    });

    setNewVendor({ name: "", wallet: "", category: "" });
    setShowVendorDialog(false);
  };

  const handleAidAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseInt(aidAllocationForm.amount);
    
    // Update beneficiary aid balance
    const allUsers = JSON.parse(sessionStorage.getItem('allUsers') || '[]');
    const updatedUsers = allUsers.map((user: any) => {
      if (user.digitalId === aidAllocationForm.beneficiaryId) {
        return { ...user, aidBalance: (user.aidBalance || 0) + amount };
      }
      return user;
    });
    sessionStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    
    // Update beneficiaries list
    const updatedBeneficiaries = beneficiaries.map(b => {
      if (b.id === aidAllocationForm.beneficiaryId) {
        return { ...b, aidReceived: b.aidReceived + amount };
      }
      return b;
    });
    setBeneficiaries(updatedBeneficiaries);
    
    // Update NGO stats
    updateNGOStats({
      totalAidDistributed: ngoData.totalAidDistributed + amount,
      currentBalance: ngoData.currentBalance - amount
    });

    // Save transaction
    const beneficiary = beneficiaries.find(b => b.id === aidAllocationForm.beneficiaryId);
    const transaction = {
      type: "Aid Allocation",
      user: beneficiary?.name || "Unknown",
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      category: aidAllocationForm.category
    };
    saveTransaction(transaction);
    setTransactions(getTransactions());
    
    toast({
      title: "Aid Allocated Successfully",
      description: `$${amount} allocated to ${beneficiary?.name}.`,
    });
    setAidAllocationForm({ beneficiaryId: "", amount: "", category: "" });
  };

  const handleBeneficiaryAction = (action: string, beneficiaryId: string, beneficiaryName: string) => {
    if (action === "view") {
      const beneficiary = beneficiaries.find(b => b.id === beneficiaryId);
      setSelectedBeneficiary(beneficiary);
      return;
    }

    // Update beneficiary status
    const updatedBeneficiaries = beneficiaries.map(b => {
      if (b.id === beneficiaryId) {
        let newStatus = b.status;
        if (action === "verify") newStatus = "verified";
        if (action === "suspend") newStatus = "suspended";
        return { ...b, status: newStatus, verification: newStatus };
      }
      return b;
    });
    setBeneficiaries(updatedBeneficiaries);

    // Save transaction
    const transaction = {
      type: "Beneficiary Action",
      user: beneficiaryName,
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      action: action
    };
    saveTransaction(transaction);
    setTransactions(getTransactions());

    toast({
      title: `Beneficiary ${action}d`,
      description: `${beneficiaryName} has been ${action}d successfully.`,
    });
  };

  const handleVendorAction = (action: string, vendorId: string, vendorName: string) => {
    if (action === "view") {
      toast({
        title: "Vendor Details",
        description: `Viewing details for ${vendorName}`,
      });
      return;
    }

    // Update vendor status
    const updatedVendors = vendors.map(v => {
      if (v.id === vendorId) {
        const newStatus = action === "activate" ? "active" : "inactive";
        return { ...v, status: newStatus };
      }
      return v;
    });
    setVendors(updatedVendors);
    sessionStorage.setItem('vendors', JSON.stringify(updatedVendors));

    // Update NGO stats
    updateNGOStats({
      activeVendors: updatedVendors.filter(v => v.status === "active").length
    });

    toast({
      title: `Vendor ${action}d`,
      description: `${vendorName} has been ${action}d successfully.`,
    });
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
                value={`$${ngoData.totalAidDistributed.toLocaleString()}`}
                description="+12% from last month"
                icon={Coins}
                variant="success"
              />
              <StatCard
                title="Total Beneficiaries"
                value={ngoData.totalBeneficiaries.toString()}
                description="Active registrations"
                icon={Users}
                variant="default"
              />
              <StatCard
                title="Active Vendors"
                value={ngoData.activeVendors.toString()}
                description="Partnership network"
                icon={Building}
                variant="accent"
              />
              <StatCard
                title="Current Balance"
                value={`$${ngoData.currentBalance.toLocaleString()}`}
                description="Available for allocation"
                icon={TrendingUp}
                variant="default"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest aid allocations and actions</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowAllTransactions(true)}>
                    View All Transactions
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.slice(0, 5).map((transaction, index) => (
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
                  <Dialog open={showBeneficiaryDialog} onOpenChange={setShowBeneficiaryDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full justify-start">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Register New Beneficiary
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Register New Beneficiary</DialogTitle>
                        <DialogDescription>Add a new beneficiary to the system</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={newBeneficiary.name}
                            onChange={(e) => setNewBeneficiary(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={newBeneficiary.location}
                            onChange={(e) => setNewBeneficiary(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="Enter location"
                          />
                        </div>
                        <div>
                          <Label htmlFor="emergency">Emergency Contact</Label>
                          <Input
                            id="emergency"
                            value={newBeneficiary.emergencyContact}
                            onChange={(e) => setNewBeneficiary(prev => ({ ...prev, emergencyContact: e.target.value }))}
                            placeholder="Enter emergency contact"
                          />
                        </div>
                        <Button onClick={handleRegisterBeneficiary} className="w-full">
                          Register Beneficiary
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("allocation")}>
                    <Coins className="mr-2 h-4 w-4" />
                    Allocate Aid Tokens
                  </Button>

                  <Dialog open={showVendorDialog} onOpenChange={setShowVendorDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Building className="mr-2 h-4 w-4" />
                        Add New Vendor
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Vendor</DialogTitle>
                        <DialogDescription>Register a new vendor partner</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="vendorName">Vendor Name</Label>
                          <Input
                            id="vendorName"
                            value={newVendor.name}
                            onChange={(e) => setNewVendor(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter vendor name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="wallet">Wallet Address</Label>
                          <Input
                            id="wallet"
                            value={newVendor.wallet}
                            onChange={(e) => setNewVendor(prev => ({ ...prev, wallet: e.target.value }))}
                            placeholder="0x..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select value={newVendor.category} onValueChange={(value) => setNewVendor(prev => ({ ...prev, category: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="food">Food & Nutrition</SelectItem>
                              <SelectItem value="health">Healthcare</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="general">General Store</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={handleAddVendor} className="w-full">
                          Add Vendor
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("analytics")}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
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
              <Button onClick={() => setShowBeneficiaryDialog(true)}>
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
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Hash</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Photo</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aid Balance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {beneficiaries.filter(b => 
                      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      b.id.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((beneficiary) => (
                      <TableRow key={beneficiary.id}>
                        <TableCell className="font-mono">{beneficiary.id}</TableCell>
                        <TableCell>{beneficiary.name}</TableCell>
                        <TableCell>
                          {beneficiary.hasPhoto && beneficiary.biometricPhoto ? (
                            <img 
                              src={beneficiary.biometricPhoto} 
                              alt="Beneficiary" 
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                              <User className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{beneficiary.location}</TableCell>
                        <TableCell>
                          <Badge variant={
                            beneficiary.status === "verified" ? "default" :
                            beneficiary.status === "pending" ? "secondary" : "destructive"
                          }>
                            {beneficiary.status}
                          </Badge>
                        </TableCell>
                        <TableCell>${beneficiary.aidReceived}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleBeneficiaryAction("view", beneficiary.id, beneficiary.name)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleBeneficiaryAction("verify", beneficiary.id, beneficiary.name)}
                              disabled={beneficiary.status === "verified"}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleBeneficiaryAction("suspend", beneficiary.id, beneficiary.name)}
                              disabled={beneficiary.status === "suspended"}
                            >
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
              <Button onClick={() => setShowVendorDialog(true)}>
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
                    {vendors.map((vendor) => (
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
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleVendorAction("view", vendor.id, vendor.name)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleVendorAction(vendor.status === "active" ? "deactivate" : "activate", vendor.id, vendor.name)}
                            >
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
                          {beneficiaries.filter(b => b.status === "verified").map((beneficiary) => (
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
                    {transactions.filter(t => t.type === "Aid Allocation").slice(0, 5).map((transaction, index) => (
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
                  <CardDescription>Aid distribution over time by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="food" fill="#8884d8" name="Food" />
                      <Bar dataKey="health" fill="#82ca9d" name="Health" />
                      <Bar dataKey="education" fill="#ffc658" name="Education" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Aid Categories Distribution</CardTitle>
                  <CardDescription>Distribution by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Impact Metrics</CardTitle>
                <CardDescription>Key performance indicators based on real data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{Math.round((beneficiaries.filter(b => b.status === "verified").length / beneficiaries.length) * 100)}%</div>
                    <p className="text-sm text-muted-foreground">Verification Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{Math.round((vendors.filter(v => v.status === "active").length / vendors.length) * 100)}%</div>
                    <p className="text-sm text-muted-foreground">Active Vendors</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">${Math.round(ngoData.totalAidDistributed / ngoData.totalBeneficiaries)}</div>
                    <p className="text-sm text-muted-foreground">Avg. Aid per Beneficiary</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{transactions.length}</div>
                    <p className="text-sm text-muted-foreground">Total Transactions</p>
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
                    {transactions.slice(0, 10).map((transaction, index) => (
                      <TableRow key={index}>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell>{transaction.user}</TableCell>
                        <TableCell>${transaction.amount}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell className="font-mono">{transaction.hash}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" onClick={() => toast({ title: "Blockchain View", description: "Would open blockchain explorer" })}>
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

      {/* Dialogs */}
      {selectedBeneficiary && (
        <Dialog open={!!selectedBeneficiary} onOpenChange={() => setSelectedBeneficiary(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Beneficiary Profile</DialogTitle>
              <DialogDescription>View beneficiary details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {selectedBeneficiary.hasPhoto && selectedBeneficiary.biometricPhoto ? (
                  <img 
                    src={selectedBeneficiary.biometricPhoto} 
                    alt="Beneficiary" 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold">{selectedBeneficiary.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedBeneficiary.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Location</Label>
                  <p className="text-sm">{selectedBeneficiary.location}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge variant={selectedBeneficiary.status === "verified" ? "default" : "secondary"}>
                    {selectedBeneficiary.status}
                  </Badge>
                </div>
                <div>
                  <Label>Aid Balance</Label>
                  <p className="text-sm">${selectedBeneficiary.aidReceived}</p>
                </div>
                <div>
                  <Label>Verification Method</Label>
                  <p className="text-sm">{selectedBeneficiary.verificationMethod || "Digital Identity"}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* All Transactions Dialog */}
      <Dialog open={showAllTransactions} onOpenChange={setShowAllTransactions}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>All Transactions</DialogTitle>
            <DialogDescription>Complete transaction history</DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Hash</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>{transaction.user}</TableCell>
                    <TableCell>${transaction.amount}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell className="font-mono text-xs">{transaction.hash}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NGODashboard;