import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Leaf, LogIn, UserPlus, Shield, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<"citizen" | "admin">("citizen");
  const [sex, setSex] = useState<"male" | "female" | "other" | "">("");
  const [gender, setGender] = useState("");
  const [showConfigWarning, setShowConfigWarning] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setShowConfigWarning(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Fetch user profile to get role
        const { data: userProfile, error: profileError } = await supabase
          .from("users")
          .select("role")
          .eq("id", authData.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
        }

        // Type assertion needed due to TypeScript inference issues with Supabase types
        const profile = userProfile as { role: "citizen" | "admin" } | null;
        const userRole = profile?.role || userType;
        
        toast({
          title: "Login Successful",
          description: "Welcome back to CleanWard!",
        });
        
        navigate(userRole === "admin" ? "/authority" : "/citizen");
      }
    } catch (error: any) {
      let errorMessage = error.message || "Invalid email or password";
      
      // Provide helpful error messages for common issues
      if (error.message?.includes("Invalid API key") || error.message?.includes("JWT")) {
        errorMessage = "Invalid Supabase API key. Please check your .env file and ensure VITE_SUPABASE_ANON_KEY is set correctly. See SUPABASE_SETUP.md for help.";
      } else if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please check your credentials.";
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "Please check your email and confirm your account before logging in.";
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      toast({
        title: "Configuration Required",
        description: "Please set up Supabase credentials in your .env file. See SUPABASE_SETUP.md for instructions.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("signupEmail") as string;
    const phone = formData.get("phone") as string;
    const ageStr = formData.get("age") as string;
    const sexValue = sex;
    const genderValue = gender || "";
    const wardNumberStr = formData.get("wardNumber") as string;
    const password = formData.get("signupPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !ageStr || !sexValue || !wardNumberStr || !password) {
      toast({
        title: "Registration Failed",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const age = parseInt(ageStr);
    const wardNumber = parseInt(wardNumberStr);

    // Validate age
    if (isNaN(age) || age < 18 || age > 100) {
      toast({
        title: "Registration Failed",
        description: "Age must be between 18 and 100",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validate ward number
    if (isNaN(wardNumber) || wardNumber < 1 || wardNumber > 250) {
      toast({
        title: "Registration Failed",
        description: "Ward number must be between 1 and 250",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validate sex
    if (!sexValue || !["male", "female", "other"].includes(sexValue)) {
      toast({
        title: "Registration Failed",
        description: "Please select your sex",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      toast({
        title: "Registration Failed",
        description: "Passwords do not match",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      toast({
        title: "Registration Failed",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Wait a moment for the session to be established
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Refresh the session to ensure it's properly set for RLS
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.warn("Session warning:", sessionError);
        }

        // Try using the database function first (if available), otherwise use direct insert
        try {
          const { error: functionError } = await (supabase.rpc as any)('create_user_profile', {
            user_id: authData.user.id,
            user_first_name: firstName,
            user_last_name: lastName,
            user_email: email,
            user_ward_number: wardNumber,  // Required parameter - must come before optional ones
            user_phone: phone || null,
            user_age: age || null,
            user_sex: sexValue,
            user_gender: genderValue || null,
            user_role: userType,
          });

          if (functionError) throw functionError;
        } catch (functionError: any) {
          // If function doesn't exist or fails, try direct insert
          console.log("Function not available, using direct insert");
          
          const { error: profileError } = await supabase
            .from("users")
            .insert({
              id: authData.user.id,
              first_name: firstName,
              last_name: lastName,
              email,
              phone: phone || null,
              age: age || null,
              sex: sexValue as "male" | "female" | "other",
              gender: genderValue || null,
              ward_number: wardNumber,
              role: userType,
            } as any);

          if (profileError) throw profileError;
        }

        toast({
          title: "Registration Successful",
          description: "Your account has been created. Welcome to CleanWard!",
        });
        
        navigate("/citizen");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessage = error.message || "Failed to create account. Please try again.";
      
      // Provide helpful error messages for common issues
      if (error.message?.includes("Invalid API key") || error.message?.includes("JWT") || error.message?.includes("Invalid token")) {
        errorMessage = "Invalid Supabase API key. Please check your .env file and ensure VITE_SUPABASE_ANON_KEY is set correctly. See SUPABASE_SETUP.md for help.";
      } else if (error.message?.includes("User already registered") || error.message?.includes("already registered")) {
        errorMessage = "An account with this email already exists. Please try logging in instead.";
      } else if (error.message?.includes("Email rate limit exceeded")) {
        errorMessage = "Too many registration attempts. Please wait a few minutes and try again.";
      } else if (error.message?.includes("relation") && error.message?.includes("does not exist")) {
        errorMessage = "Database table not found. Please run the migration SQL script in Supabase. See SUPABASE_SETUP.md for instructions.";
      } else if (error.message?.includes("duplicate key") || error.message?.includes("unique constraint")) {
        errorMessage = "An account with this email already exists. Please try logging in instead.";
      }
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                <Leaf className="h-7 w-7 text-primary-foreground" />
              </div>
            </Link>
            <h1 className="text-2xl font-heading font-bold">Welcome to CleanWard</h1>
            <p className="text-muted-foreground mt-2">
              Sign in or create an account to participate
            </p>
          </div>

          {showConfigWarning && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Supabase Not Configured</AlertTitle>
              <AlertDescription>
                Please set up your Supabase credentials in a .env file. See SUPABASE_SETUP.md for detailed instructions.
                <br />
                <strong>Required:</strong> VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="login" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login" className="gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Register
                  </TabsTrigger>
                </TabsList>

                {/* Login Form */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label>I am a</Label>
                      <Select value={userType} onValueChange={(v: "citizen" | "admin") => setUserType(v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="citizen">Citizen</SelectItem>
                          <SelectItem value="admin">Authority / Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="your@email.com" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" name="password" type="password" placeholder="••••••••" required />
                    </div>

                    <Button type="submit" variant="civic" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      <a href="#" className="hover:text-primary">Forgot your password?</a>
                    </p>
                  </form>
                </TabsContent>

                {/* Signup Form */}
                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label>I am a</Label>
                      <Select value={userType} onValueChange={(v: "citizen" | "admin") => setUserType(v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="citizen">Citizen</SelectItem>
                          <SelectItem value="admin">Authority / Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" name="firstName" placeholder="John" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" name="lastName" placeholder="Doe" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signupEmail">Email</Label>
                      <Input id="signupEmail" name="signupEmail" type="email" placeholder="your@email.com" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" type="tel" placeholder="+91 XXXXX XXXXX" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input id="age" name="age" type="number" placeholder="25" min="18" max="100" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sex">Sex</Label>
                        <Select value={sex} onValueChange={(v: "male" | "female" | "other") => setSex(v)} required>
                          <SelectTrigger id="sex">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Input id="gender" name="gender" value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Enter your gender" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="wardNumber">Ward Number</Label>
                      <Input id="wardNumber" name="wardNumber" type="number" placeholder="Enter your ward number (1-250)" min="1" max="250" required />
                      <p className="text-xs text-muted-foreground">
                        Don't know your ward? <Link to="/map" className="text-primary hover:underline">Find it on the map</Link>
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signupPassword">Password</Label>
                      <Input id="signupPassword" name="signupPassword" type="password" placeholder="••••••••" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" required />
                    </div>

                    <Button type="submit" variant="civic" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground">
                      By registering, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Admin Note */}
          <Card className="mt-4 bg-muted/50">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Authority Access</p>
                  <p className="text-muted-foreground">
                    Government officials can login with their official credentials to access the analytics dashboard.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AuthPage;
