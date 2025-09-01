import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Building, Mail, Lock, ArrowRight } from "lucide-react";

const NGOLogin = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Login Successful",
        description: "Welcome to the NGO dashboard.",
      });
      // Redirect to NGO dashboard
      window.location.href = "/ngo-dashboard";
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Building className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground">NGO Login</h1>
          <p className="text-muted-foreground mt-2">
            Access your organization's aid distribution dashboard
          </p>
        </div>

        <Card className="shadow-medium border-0">
          <CardHeader className="text-center">
            <CardTitle>Sign In to Your Account</CardTitle>
            <CardDescription>
              Manage aid distribution and track impact across your programs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your@organization.org"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <a href="#" className="text-primary hover:text-primary-light">
                  Forgot password?
                </a>
              </div>
              
              <Button 
                type="submit" 
                className="w-full group" 
                disabled={isLoading || !formData.email || !formData.password}
              >
                {isLoading ? (
                  "Signing In..."
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                New organization?{" "}
                <a href="#" className="text-primary hover:text-primary-light font-medium">
                  Request partnership
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-primary">
                <Building className="h-4 w-4" />
                <span className="font-medium">Trusted by 89+ humanitarian organizations</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Join the transparent aid distribution network
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NGOLogin;