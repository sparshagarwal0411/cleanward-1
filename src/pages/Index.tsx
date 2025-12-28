import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WardSearch } from "@/components/WardSearch";
import { StatCard } from "@/components/StatCard";
import { Layout } from "@/components/Layout";
import { 
  MapPin, 
  Users, 
  Building2, 
  HeartHandshake, 
  Leaf, 
  Wind, 
  Droplets, 
  Trash2, 
  Volume2,
  ArrowRight,
  CheckCircle,
  TrendingDown,
  Shield,
  BarChart3
} from "lucide-react";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="text-sm px-4 py-1.5">
              Government of NCT of Delhi Initiative
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-primary-foreground leading-tight text-balance">
              Ward-Wise Pollution Awareness & Action Dashboard
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto font-body">
              Empowering Delhi's 250 wards with real-time pollution data, education, and actionable steps for cleaner communities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <WardSearch placeholder="Search your ward by name or number..." />
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <Link to="/map">
                <Button variant="hero" size="xl" className="gap-2">
                  <MapPin className="h-5 w-5" />
                  Explore Ward Map
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="hero-outline" size="xl" className="gap-2">
                  Join as Citizen
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L60 45.7C120 41.3 240 32.7 360 32.3C480 32 600 40 720 48.3C840 56.7 960 65.3 1080 65C1200 64.7 1320 55.3 1380 50.7L1440 46V101H1380C1320 101 1200 101 1080 101C960 101 840 101 720 101C600 101 480 101 360 101C240 101 120 101 60 101H0V50Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <StatCard
              title="Total Wards"
              value="250"
              description="Across 11 zones"
              icon={MapPin}
              variant="primary"
            />
            <StatCard
              title="Citizens Engaged"
              value="1.2M+"
              description="Active participants"
              icon={Users}
              variant="success"
            />
            <StatCard
              title="NGOs Registered"
              value="450+"
              description="Partner organizations"
              icon={Building2}
              variant="warning"
            />
            <StatCard
              title="Actions Taken"
              value="25K+"
              description="This month"
              icon={HeartHandshake}
              variant="primary"
            />
          </div>
        </div>
      </section>

      {/* Pollution Categories */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">
              Comprehensive Pollution Monitoring
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Track and understand pollution across four key dimensions in your ward
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="civic" className="text-center">
              <CardHeader>
                <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Wind className="h-7 w-7 text-primary" />
                </div>
                <CardTitle>Air Quality</CardTitle>
                <CardDescription>
                  PM2.5, PM10, AQI monitoring with health advisories
                </CardDescription>
              </CardHeader>
            </Card>

            <Card variant="civic" className="text-center">
              <CardHeader>
                <div className="mx-auto h-14 w-14 rounded-full bg-info/10 flex items-center justify-center mb-2">
                  <Droplets className="h-7 w-7 text-info" />
                </div>
                <CardTitle>Water Quality</CardTitle>
                <CardDescription>
                  Groundwater, drainage, and drinking water assessment
                </CardDescription>
              </CardHeader>
            </Card>

            <Card variant="civic" className="text-center">
              <CardHeader>
                <div className="mx-auto h-14 w-14 rounded-full bg-warning/10 flex items-center justify-center mb-2">
                  <Trash2 className="h-7 w-7 text-warning" />
                </div>
                <CardTitle>Waste Management</CardTitle>
                <CardDescription>
                  Solid waste handling, segregation, and disposal rates
                </CardDescription>
              </CardHeader>
            </Card>

            <Card variant="civic" className="text-center">
              <CardHeader>
                <div className="mx-auto h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
                  <Volume2 className="h-7 w-7 text-destructive" />
                </div>
                <CardTitle>Noise Levels</CardTitle>
                <CardDescription>
                  Decibel monitoring across residential and commercial areas
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">
              How CleanWard Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From data to action — empowering every citizen to make a difference
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <h3 className="font-heading text-xl font-semibold">Find Your Ward</h3>
              <p className="text-muted-foreground">
                Search by ward number, name, or explore the interactive map to locate your area
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-2xl font-bold">
                2
              </div>
              <h3 className="font-heading text-xl font-semibold">Understand the Data</h3>
              <p className="text-muted-foreground">
                View pollution scores, trends, sources, and educational content specific to your ward
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-success text-success-foreground flex items-center justify-center text-2xl font-bold">
                3
              </div>
              <h3 className="font-heading text-xl font-semibold">Take Action</h3>
              <p className="text-muted-foreground">
                Follow ward-specific recommendations and track your personal contribution goals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">
              Get Involved
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Multiple ways to contribute to Delhi's cleaner future
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <HeartHandshake className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Contribute to the Cause</CardTitle>
                <CardDescription>
                  Support ward-level initiatives financially
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="civic" className="w-full">Donate Now</Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-full bg-success/10 flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-success" />
                </div>
                <CardTitle className="text-lg">Join as Volunteer</CardTitle>
                <CardDescription>
                  Participate in clean-up drives and awareness campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="civic-outline" className="w-full">Register</Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center mb-2">
                  <Building2 className="h-6 w-6 text-warning" />
                </div>
                <CardTitle className="text-lg">Register Your NGO</CardTitle>
                <CardDescription>
                  Partner with us for on-ground implementation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="civic-outline" className="w-full">Apply</Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-full bg-info/10 flex items-center justify-center mb-2">
                  <Shield className="h-6 w-6 text-info" />
                </div>
                <CardTitle className="text-lg">Partner with Municipality</CardTitle>
                <CardDescription>
                  Corporate partnerships for sustainable impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="civic-outline" className="w-full">Learn More</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features for Different Users */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card variant="elevated" className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-bold">For Citizens</h3>
                  <p className="text-muted-foreground">Your personal pollution dashboard</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>View your ward's real-time pollution data</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Learn why pollution is high in your area</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Set and track personal green goals</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Access educational videos and guides</span>
                </li>
              </ul>
              <Link to="/citizen">
                <Button variant="civic" size="lg" className="w-full gap-2">
                  Access Citizen Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </Card>

            <Card variant="elevated" className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-14 w-14 rounded-full bg-secondary/10 flex items-center justify-center">
                  <BarChart3 className="h-7 w-7 text-secondary" />
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-bold">For Authorities</h3>
                  <p className="text-muted-foreground">Advanced analytics portal</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>City-wide pollution overview and trends</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Ward comparison and ranking analytics</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Resource allocation insights</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Citizen engagement metrics</span>
                </li>
              </ul>
              <Link to="/authority">
                <Button variant="civic-secondary" size="lg" className="w-full gap-2">
                  Access Authority Portal
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
