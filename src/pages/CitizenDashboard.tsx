import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PollutionScore, TrendIndicator } from "@/components/PollutionScore";
import { getWardById, getStatusFromScore } from "@/data/wards";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePollutionData } from "@/hooks/usePollutionData";
import {
  User,
  MapPin,
  Target,
  TreeDeciduous,
  Trash2,
  Droplets,
  BookOpen,
  Play,
  CheckCircle,
  Plus,
  Award,
  Calendar,
  TrendingUp,
  Gauge,
  RefreshCw,
  LogOut,
  Settings
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { WardSelector } from "@/components/WardSelector";
import { TrafficIndicator } from "@/components/TrafficIndicator";

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  age: number | null;
  sex: 'male' | 'female' | 'other' | null;
  gender: string | null;
  ward_number: number;
  role: 'citizen' | 'admin';
  created_at: string;
}

const mockGoals = [
  { id: "1", title: "Garbage Collection", description: "Participate in waste collection drives", target: 10, current: 7, unit: "kg", category: "waste", icon: Trash2 },
  { id: "2", title: "Trees Planted", description: "Plant saplings in your ward", target: 5, current: 3, unit: "trees", category: "tree", icon: TreeDeciduous },
  { id: "3", title: "Water Saved", description: "Track daily water conservation", target: 1000, current: 650, unit: "liters", category: "water", icon: Droplets },
  { id: "4", title: "Awareness Sessions", description: "Attend pollution awareness workshops", target: 4, current: 2, unit: "sessions", category: "awareness", icon: BookOpen },
];

const educationalVideos = [
  { id: "1", title: "How to Reduce Air Pollution in Your Ward", duration: "8:45", thumbnail: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&q=80" },
  { id: "2", title: "Water Conservation Tips for Delhi Homes", duration: "6:30", thumbnail: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80" },
  { id: "3", title: "Proper Waste Segregation Guide", duration: "5:15", thumbnail: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&q=80" },
  { id: "4", title: "Noise Pollution: What Can You Do?", duration: "7:20", thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
];

const actionSteps = [
  { step: 1, title: "Use Public Transport", description: "Switch to metro, bus, or carpool at least 3 days a week", completed: true },
  { step: 2, title: "Segregate Waste Daily", description: "Separate wet, dry, and hazardous waste at home", completed: true },
  { step: 3, title: "Plant a Sapling", description: "Plant at least one tree or shrub in your locality", completed: false },
  { step: 4, title: "Report Burning", description: "Report any open burning incidents via the app", completed: false },
  { step: 5, title: "Join Clean-up Drive", description: "Participate in ward's monthly cleanliness drive", completed: false },
];

const CitizenDashboard = () => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(mockGoals.map(g => g.id));
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { wards, isLoading: pollutionLoading, refetch, isUsingRealData } = usePollutionData();

  const [isChangeWardOpen, setIsChangeWardOpen] = useState(false);
  const [newWardNumber, setNewWardNumber] = useState("");
  const [updatingWard, setUpdatingWard] = useState(false);

  const handleUpdateWard = async () => {
    if (!userData) return;

    const wardNum = parseInt(newWardNumber);
    if (isNaN(wardNum) || wardNum < 1 || wardNum > 250) {
      toast({
        title: "Invalid Ward Number",
        description: "Please enter a valid ward number between 1 and 250",
        variant: "destructive",
      });
      return;
    }

    setUpdatingWard(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({ ward_number: wardNum } as any)
        .eq("id", userData.id);

      if (error) throw error;

      setUserData({ ...userData, ward_number: wardNum });
      setIsChangeWardOpen(false);

      toast({
        title: "Ward Updated",
        description: `Your ward has been updated to Ward ${wardNum}`,
      });
    } catch (error) {
      console.error("Error updating ward:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update ward number. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingWard(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          toast({
            title: "Authentication Required",
            description: "Please log in to access your dashboard",
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }

        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          toast({
            title: "Error",
            description: "Failed to load user data",
            variant: "destructive",
          });
        } else {
          setUserData(profile);
        }
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, toast]);

  const baseWard = userData ? getWardById(userData.ward_number) : null;
  const wardWithAQI = userData ? wards.find(w => w.id === userData.ward_number) || baseWard : null;
  const ward = wardWithAQI || baseWard;
  const userName = userData ? `${userData.first_name} ${userData.last_name}` : "User";

  const getAQICategory = (aqi: number) => {
    if (aqi <= 50) return { label: 'Good', color: 'text-success', bg: 'bg-success/10' };
    if (aqi <= 100) return { label: 'Moderate', color: 'text-info', bg: 'bg-info/10' };
    if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: 'text-warning', bg: 'bg-warning/10' };
    if (aqi <= 200) return { label: 'Unhealthy', color: 'text-destructive', bg: 'bg-destructive/10' };
    if (aqi <= 300) return { label: 'Very Unhealthy', color: 'text-destructive', bg: 'bg-destructive/20' };
    return { label: 'Hazardous', color: 'text-destructive', bg: 'bg-destructive/30' };
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-lg font-semibold mb-2">Loading your dashboard...</div>
              <div className="text-sm text-muted-foreground">Please wait</div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!userData || !ward) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-lg font-semibold mb-2">Unable to load dashboard</div>
              <div className="text-sm text-muted-foreground mb-4">Please try logging in again</div>
              <Button onClick={() => navigate("/auth")}>Go to Login</Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">Citizen Dashboard</h1>
            <p className="text-muted-foreground">
              Track your progress and take action for a cleaner {ward?.name || "ward"}
            </p>
          </div>
          <Dialog open={isChangeWardOpen} onOpenChange={setIsChangeWardOpen}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Card className="p-4 cursor-pointer hover:bg-accent/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{userName}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Ward {userData.ward_number}
                      </div>
                    </div>
                  </div>
                </Card>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  setNewWardNumber(userData.ward_number.toString());
                  setIsChangeWardOpen(true);
                }}>
                  <Settings className="mr-2 h-4 w-4" />
                  Change Ward
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  supabase.auth.signOut().then(() => navigate("/auth"));
                }} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Ward</DialogTitle>
                <DialogDescription>
                  Enter your new ward number (1-250) to update your location.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ward" className="text-right">
                    Ward
                  </Label>
                  <div className="col-span-3">
                    <WardSelector
                      value={newWardNumber ? parseInt(newWardNumber) : undefined}
                      onChange={(val) => setNewWardNumber(val.toString())}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsChangeWardOpen(false)}>Cancel</Button>
                <Button onClick={handleUpdateWard} disabled={updatingWard}>
                  {updatingWard ? "Updating..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ward Pollution Summary */}
            {ward && (
              <div className="space-y-4">
                <Card variant="civic">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Your Ward: {ward.name}
                    </CardTitle>
                    <div className="flex items-center justify-between">
                      <CardDescription>Current pollution status and trends</CardDescription>
                      {ward.trafficStatus && (
                        <TrafficIndicator status={ward.trafficStatus} className="scale-90 origin-right" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <PollutionScore score={ward.pollutionScore} size="lg" />
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Air Quality</div>
                          <div className="text-xl font-semibold">{ward.airQuality}/100</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Water Quality</div>
                          <div className="text-xl font-semibold">{ward.waterQuality}/100</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Waste Management</div>
                          <div className="text-xl font-semibold">{ward.wasteManagement}/100</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Noise Level</div>
                          <div className="text-xl font-semibold">{ward.noiseLevel}/100</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <TrendIndicator value={ward.trend7Days} label="7 days" />
                        <TrendIndicator value={ward.trend30Days} label="30 days" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Live AQI Display */}
                {wardWithAQI && wardWithAQI.aqi !== undefined && wardWithAQI.aqi !== null && (
                  <Card className="border-2 border-primary/20">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Gauge className="h-5 w-5 text-primary" />
                          Live Air Quality Index (AQI)
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          {isUsingRealData && (
                            <Badge variant="default" className="bg-success text-success-foreground">
                              Live
                            </Badge>
                          )}
                          <Button variant="ghost" size="icon" onClick={refetch} disabled={pollutionLoading}>
                            <RefreshCw className={`h-4 w-4 ${pollutionLoading ? 'animate-spin' : ''}`} />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-primary">{wardWithAQI.aqi}</div>
                          <div className="text-sm text-muted-foreground mt-1">AQI</div>
                        </div>
                        <div className="flex-1">
                          {(() => {
                            const category = getAQICategory(wardWithAQI.aqi!);
                            return (
                              <div className={`p-4 rounded-lg ${category.bg}`}>
                                <div className={`font-semibold text-lg ${category.color}`}>
                                  {category.label}
                                </div>
                                {wardWithAQI.pm25 && (
                                  <div className="text-sm text-muted-foreground mt-2">
                                    PM2.5: {wardWithAQI.pm25} µg/m³
                                  </div>
                                )}
                                {wardWithAQI.lastUpdated && (
                                  <div className="text-xs text-muted-foreground mt-2">
                                    Updated: {new Date(wardWithAQI.lastUpdated).toLocaleString()}
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Tabs for Content */}
            <Tabs defaultValue="goals" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="goals" className="gap-2">
                  <Target className="h-4 w-4" />
                  My Goals
                </TabsTrigger>
                <TabsTrigger value="videos" className="gap-2">
                  <Play className="h-4 w-4" />
                  Learn
                </TabsTrigger>
                <TabsTrigger value="actions" className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Actions
                </TabsTrigger>
              </TabsList>

              {/* Goals Tab */}
              <TabsContent value="goals" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-semibold">Your Green Goals</h3>
                  <Button variant="civic-outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Goal
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {mockGoals.map((goal) => (
                    <Card key={goal.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <goal.icon className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle className="text-base">{goal.title}</CardTitle>
                          </div>
                          <Badge variant="outline">
                            {goal.current}/{goal.target} {goal.unit}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
                        <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-2">
                          {Math.round((goal.current / goal.target) * 100)}% complete
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Videos Tab */}
              <TabsContent value="videos" className="space-y-4">
                <h3 className="font-heading text-lg font-semibold">Educational Videos</h3>
                <p className="text-muted-foreground">
                  Learn how to reduce pollution in your ward with these guides
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  {educationalVideos.map((video) => (
                    <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                      <div className="relative">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center">
                            <Play className="h-6 w-6 text-primary-foreground ml-1" />
                          </div>
                        </div>
                        <Badge className="absolute bottom-2 right-2 bg-foreground/80">
                          {video.duration}
                        </Badge>
                      </div>
                      <CardContent className="pt-4">
                        <h4 className="font-semibold group-hover:text-primary transition-colors">
                          {video.title}
                        </h4>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Actions Tab */}
              <TabsContent value="actions" className="space-y-4">
                <h3 className="font-heading text-lg font-semibold">Steps to Reduce Pollution</h3>
                <p className="text-muted-foreground">
                  Follow these ward-specific actions to make a difference
                </p>

                <div className="space-y-3">
                  {actionSteps.map((action) => (
                    <Card key={action.step} className={action.completed ? "border-success/30 bg-success/5" : ""}>
                      <CardContent className="py-4">
                        <div className="flex items-start gap-4">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${action.completed
                            ? "bg-success text-success-foreground"
                            : "bg-muted text-muted-foreground"
                            }`}>
                            {action.completed ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <span className="font-semibold">{action.step}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{action.title}</h4>
                            <p className="text-sm text-muted-foreground">{action.description}</p>
                          </div>
                          {!action.completed && (
                            <Button variant="civic-outline" size="sm">
                              Mark Done
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievement Card */}
            <Card variant="civic">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent" />
                  Your Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">127</div>
                  <div className="text-sm text-muted-foreground">Impact Points</div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-xl font-semibold">3</div>
                    <div className="text-xs text-muted-foreground">Trees Planted</div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-xl font-semibold">7kg</div>
                    <div className="text-xs text-muted-foreground">Waste Collected</div>
                  </div>
                </div>
                <Badge variant="success" className="w-full justify-center py-2">
                  Green Warrior Level 2
                </Badge>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-l-primary pl-3">
                  <div className="font-medium">Ward Clean-up Drive</div>
                  <div className="text-sm text-muted-foreground">Jan 28, 2024 • 8:00 AM</div>
                </div>
                <div className="border-l-4 border-l-secondary pl-3">
                  <div className="font-medium">Tree Plantation Event</div>
                  <div className="text-sm text-muted-foreground">Feb 5, 2024 • 9:00 AM</div>
                </div>
                <div className="border-l-4 border-l-accent pl-3">
                  <div className="font-medium">Awareness Workshop</div>
                  <div className="text-sm text-muted-foreground">Feb 12, 2024 • 4:00 PM</div>
                </div>
                <Button variant="civic-outline" className="w-full">
                  View All Events
                </Button>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  Ward Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-accent">1</span>
                    <span>Priya M.</span>
                  </div>
                  <span className="text-sm font-medium">342 pts</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-muted-foreground">2</span>
                    <span>Amit K.</span>
                  </div>
                  <span className="text-sm font-medium">289 pts</span>
                </div>
                <div className="flex items-center justify-between bg-primary/10 -mx-3 px-3 py-2 rounded">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">5</span>
                    <span className="font-medium">You</span>
                  </div>
                  <span className="text-sm font-medium">127 pts</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CitizenDashboard;
