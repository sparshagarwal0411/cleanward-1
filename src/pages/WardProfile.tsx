import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PollutionScore, TrendIndicator } from "@/components/PollutionScore";
import { getWardById, getStatusFromScore, getStatusLabel } from "@/data/wards";
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Ruler, 
  Wind, 
  Droplets, 
  Trash2, 
  Volume2,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  BookOpen,
  ExternalLink
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const WardProfile = () => {
  const { id } = useParams<{ id: string }>();
  const ward = getWardById(parseInt(id || "1"));

  if (!ward) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Ward Not Found</h1>
          <Link to="/map">
            <Button variant="civic">Back to Map</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const pollutionData = [
    { type: 'air', label: 'Air Quality', value: ward.airQuality, icon: Wind, color: 'text-info' },
    { type: 'water', label: 'Water Quality', value: ward.waterQuality, icon: Droplets, color: 'text-primary' },
    { type: 'waste', label: 'Waste Management', value: ward.wasteManagement, icon: Trash2, color: 'text-warning' },
    { type: 'noise', label: 'Noise Level', value: ward.noiseLevel, icon: Volume2, color: 'text-destructive' },
  ];

  const educationContent = [
    {
      title: "Why is Air Quality Low?",
      content: `Ward ${ward.id} experiences elevated PM2.5 levels primarily due to ${ward.sources[0]} and ${ward.sources[1] || 'local activities'}. Dense traffic during peak hours and inadequate green cover contribute to poor air dispersion.`
    },
    {
      title: "Understanding Water Contamination",
      content: `Groundwater quality is affected by improper sewage disposal and industrial runoff. Regular testing shows elevated levels of contaminants in certain pockets of this ward.`
    },
    {
      title: "Waste Management Challenges",
      content: `With a population of ${ward.population.toLocaleString()}, the ward generates significant daily waste. Segregation compliance and timely collection remain key challenges.`
    }
  ];

  const actionItems = [
    { action: "Participate in weekly ward clean-up drives", impact: "High" },
    { action: "Report open burning incidents via the app", impact: "Medium" },
    { action: "Install air purifying plants at home", impact: "Medium" },
    { action: "Use public transport or carpool", impact: "High" },
    { action: "Segregate waste at source", impact: "High" },
    { action: "Report water leakages immediately", impact: "Low" },
  ];

  return (
    <Layout>
      <div className="container py-8">
        {/* Back Button */}
        <Link to="/map" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Map
        </Link>

        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="text-sm">Ward {ward.id}</Badge>
              <Badge variant="secondary">{ward.zone}</Badge>
            </div>
            <h1 className="text-3xl font-heading font-bold mb-2">{ward.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {ward.zone}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {ward.population.toLocaleString()} residents
              </span>
              <span className="flex items-center gap-1">
                <Ruler className="h-4 w-4" />
                {ward.area} sq km
              </span>
            </div>
          </div>

          <Card variant="pollution" className="p-6">
            <div className="flex items-center gap-6">
              <PollutionScore score={ward.pollutionScore} size="xl" />
              <div className="space-y-2">
                <div className="font-semibold">Overall Score</div>
                <TrendIndicator value={ward.trend7Days} label="7 days" />
                <TrendIndicator value={ward.trend30Days} label="30 days" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pollution Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Pollution Breakdown</CardTitle>
                <CardDescription>Individual scores across all pollution categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-6">
                  {pollutionData.map((item) => (
                    <div key={item.type} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <item.icon className={`h-5 w-5 ${item.color}`} />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <Badge variant={`pollution-${getStatusFromScore(item.value)}` as any}>
                          {item.value}
                        </Badge>
                      </div>
                      <Progress value={item.value} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Status: {getStatusLabel(getStatusFromScore(item.value))}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pollution Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Key Pollution Sources
                </CardTitle>
                <CardDescription>Major contributors to pollution in this ward</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {ward.sources.map((source) => (
                    <Badge key={source} variant="outline" className="py-2 px-4">
                      {source}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Understanding Your Ward's Pollution
                </CardTitle>
                <CardDescription>Educational context for pollution levels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {educationContent.map((item, index) => (
                  <div key={index} className="border-l-4 border-l-primary pl-4">
                    <h4 className="font-semibold mb-2">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Action Items */}
            <Card variant="civic">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-accent" />
                  Ward-Specific Actions You Can Take
                </CardTitle>
                <CardDescription>Practical steps to reduce pollution in {ward.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {actionItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                      <div className="flex-1">
                        <span>{item.action}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {item.impact} Impact
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button variant="civic">
                    Download Action Guide
                  </Button>
                  <Button variant="civic-outline">
                    Join Ward Community
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="civic" className="w-full justify-start gap-2">
                  <Users className="h-4 w-4" />
                  Join as Volunteer
                </Button>
                <Button variant="civic-outline" className="w-full justify-start gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Report Pollution
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Share Ward Data
                </Button>
              </CardContent>
            </Card>

            {/* Nearby Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Ward Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <div className="font-medium">Ward Councillor Office</div>
                  <div className="text-muted-foreground">Mon-Sat, 10AM-5PM</div>
                </div>
                <div>
                  <div className="font-medium">Nearest MCD Office</div>
                  <div className="text-muted-foreground">1.2 km away</div>
                </div>
                <div>
                  <div className="font-medium">Pollution Helpline</div>
                  <div className="text-muted-foreground">1800-XXX-XXXX</div>
                </div>
              </CardContent>
            </Card>

            {/* Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Zone Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  How does Ward {ward.id} compare to other wards in {ward.zone}?
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Zone Average</span>
                    <span className="font-medium">62</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>This Ward</span>
                    <span className="font-medium">{ward.pollutionScore}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>City Average</span>
                    <span className="font-medium">58</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WardProfile;
