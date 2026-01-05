import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/StatCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { wards, getStatusFromScore } from "@/data/wards";
import {
  BarChart3,
  MapPin,
  Users,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  Building2,
  FileText,
  Bell,
  Settings,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  Loader2,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface PendingSubmission {
  id: string;
  status: string;
  image_url: string;
  submission_text: string | null;
  submitted_at: string;
  user_id: string;
  task_id: string;
  tasks: {
    title: string;
    points: number;
    category: string;
  };
  users: {
    first_name: string;
    last_name: string;
    ward_number: number;
    score: number;
  };
}
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

// Generate chart data
const zoneData = [
  { zone: "North Delhi", score: 65, trend: -2.3 },
  { zone: "South Delhi", score: 72, trend: 1.5 },
  { zone: "East Delhi", score: 58, trend: -4.1 },
  { zone: "West Delhi", score: 61, trend: 0.8 },
  { zone: "Central Delhi", score: 54, trend: -3.2 },
  { zone: "New Delhi", score: 78, trend: 2.1 },
  { zone: "North West", score: 63, trend: -1.7 },
  { zone: "South West", score: 69, trend: 1.2 },
  { zone: "North East", score: 51, trend: -5.3 },
  { zone: "Shahdara", score: 55, trend: -2.8 },
  { zone: "South East", score: 67, trend: 0.5 },
];

const trendData = [
  { month: "Jul", air: 62, water: 68, waste: 55, noise: 72 },
  { month: "Aug", air: 58, water: 65, waste: 58, noise: 70 },
  { month: "Sep", air: 55, water: 63, waste: 60, noise: 68 },
  { month: "Oct", air: 48, water: 60, waste: 62, noise: 65 },
  { month: "Nov", air: 42, water: 58, waste: 64, noise: 63 },
  { month: "Dec", air: 38, water: 55, waste: 66, noise: 62 },
];

const pollutionBreakdown = [
  { name: "Good", value: 45, color: "hsl(142, 76%, 36%)" },
  { name: "Moderate", value: 82, color: "hsl(45, 93%, 47%)" },
  { name: "Unhealthy", value: 68, color: "hsl(25, 95%, 53%)" },
  { name: "Severe", value: 38, color: "hsl(0, 84%, 60%)" },
  { name: "Hazardous", value: 17, color: "hsl(280, 65%, 45%)" },
];

const alertsData = [
  { id: 1, type: "critical", message: "Ward 156: AQI crossed 400 threshold", time: "2 hours ago" },
  { id: 2, type: "warning", message: "Zone East Delhi: Water quality declining", time: "4 hours ago" },
  { id: 3, type: "info", message: "15 new NGOs registered this week", time: "1 day ago" },
  { id: 4, type: "warning", message: "Ward 89: Waste collection delayed", time: "1 day ago" },
];

const AuthorityDashboard = () => {
  const [pendingSubmissions, setPendingSubmissions] = useState<PendingSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [customScores, setCustomScores] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const fetchPendingSubmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_tasks")
        .select(`
          *,
          tasks (*),
          users (*)
        `)
        .eq("status", "submitted")
        .order("submitted_at", { ascending: false });

      if (error) throw error;
      setPendingSubmissions(data as any);

      // Initialize custom scores with default points
      const scores: Record<string, number> = {};
      (data as any[]).forEach(sub => {
        scores[sub.id] = sub.tasks?.points || 10;
      });
      setCustomScores(scores);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingSubmissions();
  }, []);

  const handleApprove = async (submission: PendingSubmission) => {
    try {
      const awardedPoints = customScores[submission.id] || 0;

      // 1. Update user_task
      const { error: utError } = await (supabase
        .from("user_tasks") as any)
        .update({
          status: 'verified',
          verified_at: new Date().toISOString(),
          points_rewarded: awardedPoints
        })
        .eq("id", submission.id);

      if (utError) throw utError;

      // 2. Add points to user score
      const newScore = (submission.users.score || 0) + awardedPoints;
      const { error: userError } = await (supabase
        .from("users") as any)
        .update({ score: newScore })
        .eq("id", submission.user_id);

      if (userError) throw userError;

      toast({
        title: "Action Approved",
        description: `Awarded ${awardedPoints} points to ${submission.users.first_name}.`,
      });

      fetchPendingSubmissions();
    } catch (error) {
      console.error("Error approving:", error);
      toast({
        title: "Error",
        description: "Failed to approve action.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (submissionId: string) => {
    try {
      const { error } = await (supabase
        .from("user_tasks") as any)
        .update({ status: 'rejected' })
        .eq("id", submissionId);

      if (error) throw error;

      toast({
        title: "Action Rejected",
        description: "The submission has been marked as invalid.",
      });

      fetchPendingSubmissions();
    } catch (error) {
      console.error("Error rejecting:", error);
      toast({
        title: "Error",
        description: "Failed to reject action.",
        variant: "destructive",
      });
    }
  };

  const avgScore = Math.round(wards.reduce((acc, w) => acc + w.pollutionScore, 0) / wards.length);
  const criticalWards = wards.filter(w => w.pollutionScore < 40).length;
  const improvedWards = wards.filter(w => w.trend30Days < 0).length;

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-4 items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default" className="gap-1">
                <Building2 className="h-3 w-3" />
                Authority Portal
              </Badge>
            </div>
            <h1 className="text-3xl font-heading font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              City-wide pollution monitoring and ward-level analytics
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="City Average Score"
            value={avgScore}
            description="Across all 250 wards"
            icon={BarChart3}
            variant="primary"
            trend={{ value: 2.3, isPositive: false }}
          />
          <StatCard
            title="Critical Wards"
            value={criticalWards}
            description="Score below 40"
            icon={AlertTriangle}
            variant="destructive"
          />
          <StatCard
            title="Improved Wards"
            value={improvedWards}
            description="30-day improvement"
            icon={TrendingUp}
            variant="success"
          />
          <StatCard
            title="Active Citizens"
            value="1.2M"
            description="Registered users"
            icon={Users}
            variant="primary"
          />
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="zones">Zone Analysis</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="verification" className="gap-2">
                Verification
                {pendingSubmissions.length > 0 && (
                  <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                    {pendingSubmissions.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Select defaultValue="30">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Zone Performance Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Zone Performance</CardTitle>
                  <CardDescription>Average pollution score by zone</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={zoneData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        dataKey="zone"
                        tick={{ fontSize: 11 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        className="text-muted-foreground"
                      />
                      <YAxis className="text-muted-foreground" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Distribution Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Ward Distribution</CardTitle>
                  <CardDescription>By pollution severity</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={pollutionBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pollutionBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-3 mt-4">
                    {pollutionBreakdown.map((item) => (
                      <div key={item.name} className="flex items-center gap-1 text-xs">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top/Bottom Wards */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-success" />
                    Top Performing Wards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {wards
                      .sort((a, b) => b.pollutionScore - a.pollutionScore)
                      .slice(0, 5)
                      .map((ward, index) => (
                        <div key={ward.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-muted-foreground w-5">
                              {index + 1}
                            </span>
                            <div>
                              <div className="font-medium">Ward {ward.id}</div>
                              <div className="text-xs text-muted-foreground">{ward.zone}</div>
                            </div>
                          </div>
                          <Badge variant="pollution-good">{ward.pollutionScore}</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-destructive" />
                    Wards Needing Attention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {wards
                      .sort((a, b) => a.pollutionScore - b.pollutionScore)
                      .slice(0, 5)
                      .map((ward, index) => (
                        <div key={ward.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-destructive w-5">
                              {index + 1}
                            </span>
                            <div>
                              <div className="font-medium">Ward {ward.id}</div>
                              <div className="text-xs text-muted-foreground">{ward.zone}</div>
                            </div>
                          </div>
                          <Badge variant={`pollution-${getStatusFromScore(ward.pollutionScore)}` as any}>
                            {ward.pollutionScore}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Zone Analysis Tab */}
          <TabsContent value="zones" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Zone Comparison</CardTitle>
                <CardDescription>Detailed breakdown by zone with trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {zoneData.map((zone) => (
                    <div key={zone.zone} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{zone.zone}</div>
                        <div className="text-sm text-muted-foreground">
                          {wards.filter(w => w.zone === zone.zone).length} wards
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={`pollution-${getStatusFromScore(zone.score)}` as any}>
                          Score: {zone.score}
                        </Badge>
                        <div className={`flex items-center gap-1 text-sm ${zone.trend < 0 ? 'text-success' : 'text-destructive'
                          }`}>
                          {zone.trend < 0 ? (
                            <TrendingDown className="h-4 w-4" />
                          ) : (
                            <TrendingUp className="h-4 w-4" />
                          )}
                          {Math.abs(zone.trend)}%
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pollution Trends Over Time</CardTitle>
                <CardDescription>6-month historical data by pollution type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line type="monotone" dataKey="air" stroke="hsl(200, 80%, 50%)" strokeWidth={2} name="Air Quality" />
                    <Line type="monotone" dataKey="water" stroke="hsl(210, 70%, 35%)" strokeWidth={2} name="Water Quality" />
                    <Line type="monotone" dataKey="waste" stroke="hsl(35, 90%, 50%)" strokeWidth={2} name="Waste Mgmt" />
                    <Line type="monotone" dataKey="noise" stroke="hsl(0, 72%, 51%)" strokeWidth={2} name="Noise Level" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-warning" />
                  Recent Alerts
                </CardTitle>
                <CardDescription>System notifications and warnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alertsData.map((alert) => (
                    <div
                      key={alert.id}
                      className={`flex items-start gap-4 p-4 rounded-lg border-l-4 ${alert.type === 'critical'
                        ? 'bg-destructive/5 border-l-destructive'
                        : alert.type === 'warning'
                          ? 'bg-warning/5 border-l-warning'
                          : 'bg-info/5 border-l-info'
                        }`}
                    >
                      <AlertTriangle className={`h-5 w-5 mt-0.5 ${alert.type === 'critical'
                        ? 'text-destructive'
                        : alert.type === 'warning'
                          ? 'text-warning'
                          : 'text-info'
                        }`} />
                      <div className="flex-1">
                        <div className="font-medium">{alert.message}</div>
                        <div className="text-sm text-muted-foreground">{alert.time}</div>
                      </div>
                      <Button variant="ghost" size="sm">Dismiss</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Verification Tab */}
          <TabsContent value="verification" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      Pending Action Verifications
                    </CardTitle>
                    <CardDescription>Review citizen submissions and award impact points</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={fetchPendingSubmissions} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Loading submissions...</p>
                  </div>
                ) : pendingSubmissions.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingSubmissions.map((sub) => (
                      <Card key={sub.id} className="overflow-hidden border-2 hover:border-primary/20 transition-all">
                        <div className="aspect-video relative group">
                          <img
                            src={sub.image_url}
                            alt="Verification proof"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button variant="secondary" size="sm" className="gap-2" onClick={() => window.open(sub.image_url, '_blank')}>
                              <Eye className="h-4 w-4" />
                              View Full Size
                            </Button>
                          </div>
                        </div>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{sub.tasks.category}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(sub.submitted_at).toLocaleDateString()}
                            </span>
                          </div>
                          <h4 className="font-bold text-lg mb-1">
                            {sub.task_id === 'custom-goal' ? (sub.submission_text || "Custom Goal") : (sub.tasks?.title || "Goal")}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <Users className="h-3 w-3" />
                            {sub.users.first_name} {sub.users.last_name} (Ward {sub.users.ward_number})
                          </div>
                          {sub.submission_text && sub.task_id !== 'custom-goal' && (
                            <p className="text-sm border-l-2 border-primary/20 pl-2 mb-4 italic">
                              "{sub.submission_text}"
                            </p>
                          )}

                          <div className="flex items-center gap-2 mb-4">
                            <Label htmlFor={`score-${sub.id}`} className="text-xs">Points:</Label>
                            <Input
                              id={`score-${sub.id}`}
                              type="number"
                              className="h-8 w-20 text-xs"
                              value={customScores[sub.id] || 0}
                              onChange={(e) => setCustomScores({
                                ...customScores,
                                [sub.id]: parseInt(e.target.value) || 0
                              })}
                            />
                          </div>

                          <div className="flex gap-2 pt-2 border-t">
                            <Button className="flex-1 bg-success hover:bg-success/90 gap-2" size="sm" onClick={() => handleApprove(sub)}>
                              <CheckCircle2 className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleReject(sub.id)}>
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 border-2 border-dashed rounded-xl">
                    <ShieldCheck className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-1">Queue is Empty</h3>
                    <p className="text-muted-foreground">No pending submissions for verification at this time.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AuthorityDashboard;
