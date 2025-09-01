import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Shield, QrCode, CheckCircle2, Camera, Users, Building } from "lucide-react";

const Register = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    location: "",
    emergencyContact: "",
    verificationMethod: ""
  });
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [digitalId, setDigitalId] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateId = async () => {
    setIsGenerating(true);
    // Simulate blockchain identity generation
    setTimeout(() => {
      const id = `SID-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setDigitalId(id);
      setIsGenerating(false);
      setStep(3);
      toast({
        title: "Digital Identity Created!",
        description: "Your blockchain-based identity has been successfully generated.",
      });
    }, 3000);
  };

  if (step === 3 && digitalId) {
    return (
      <div className="min-h-screen bg-gradient-subtle py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <Card className="shadow-medium border-0">
            <CardHeader className="text-center">
              <CheckCircle2 className="h-16 w-16 text-accent mx-auto mb-4" />
              <CardTitle className="text-2xl">Identity Created!</CardTitle>
              <CardDescription>
                Your digital identity is now secured on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="bg-secondary p-8 rounded-lg mb-4">
                  <QrCode className="h-24 w-24 text-primary mx-auto mb-4" />
                  <div className="font-mono text-sm bg-background p-3 rounded border">
                    {digitalId}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  This is your unique digital identity. Keep it safe and use it to access aid services.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="text-sm font-medium">{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Location</span>
                  <span className="text-sm font-medium">{formData.location}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Verification</span>
                  <span className="text-sm font-medium text-accent">Verified ✓</span>
                </div>
              </div>
              
              <Button className="w-full" onClick={() => window.location.href = "/dashboard"}>
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground">Create Digital Identity</h1>
          <p className="text-muted-foreground mt-2">
            Step {step} of 2: {step === 1 ? "Personal Information" : "Identity Verification"}
          </p>
        </div>

        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle>
              {step === 1 ? "Personal Information" : "Choose Verification Method"}
            </CardTitle>
            <CardDescription>
              {step === 1 
                ? "Provide your basic information to create your digital identity"
                : "Select how you'd like to verify your identity"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      placeholder="Age"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Textarea
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Enter your current location or address"
                    className="min-h-[80px]"
                  />
                </div>
                
                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    placeholder="Phone number or name"
                  />
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={() => setStep(2)}
                  disabled={!formData.firstName || !formData.lastName || !formData.location}
                >
                  Continue to Verification
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {isGenerating ? (
                  <div className="text-center py-8">
                    <Shield className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
                    <h3 className="text-lg font-semibold mb-2">Generating Your Digital Identity</h3>
                    <p className="text-muted-foreground mb-4">
                      Securing your identity on the blockchain...
                    </p>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full animate-pulse" style={{width: "70%"}}></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-4">
                      <Card 
                        className={`cursor-pointer transition-all border-2 ${
                          formData.verificationMethod === "biometric" 
                            ? "border-primary bg-primary-subtle" 
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => handleInputChange("verificationMethod", "biometric")}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <Camera className="h-8 w-8 text-primary" />
                            <div>
                              <h3 className="font-semibold">Biometric Verification</h3>
                              <p className="text-sm text-muted-foreground">Use facial recognition or fingerprint</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card 
                        className={`cursor-pointer transition-all border-2 ${
                          formData.verificationMethod === "community" 
                            ? "border-primary bg-primary-subtle" 
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => handleInputChange("verificationMethod", "community")}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <Users className="h-8 w-8 text-primary" />
                            <div>
                              <h3 className="font-semibold">Community Verification</h3>
                              <p className="text-sm text-muted-foreground">Verified by community members</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card 
                        className={`cursor-pointer transition-all border-2 ${
                          formData.verificationMethod === "ngo" 
                            ? "border-primary bg-primary-subtle" 
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => handleInputChange("verificationMethod", "ngo")}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <Building className="h-8 w-8 text-primary" />
                            <div>
                              <h3 className="font-semibold">NGO Referral</h3>
                              <p className="text-sm text-muted-foreground">Referred by trusted organization</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={handleGenerateId}
                      disabled={!formData.verificationMethod}
                    >
                      Generate Digital Identity
                    </Button>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;