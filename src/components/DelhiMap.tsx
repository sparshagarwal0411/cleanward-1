import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WardSearch } from "@/components/WardSearch";
import { WardCard } from "@/components/WardCard";
import { usePollutionData } from "@/hooks/usePollutionData";
import { Ward } from "@/types";
import { Map as MapIcon, Grid, List, ZoomIn, ZoomOut, RefreshCw, Wifi, WifiOff, Loader2 } from "lucide-react";

export function DelhiMap() {
  const { wards, avgPM25, lastUpdated, isLoading, isUsingRealData, refetch } = usePollutionData();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [hoveredWard, setHoveredWard] = useState<Ward | null>(null);

  const zones = [...new Set(wards.map((w: Ward) => w.zone))];

  const filteredWards = selectedZone 
    ? wards.filter((w: Ward) => w.zone === selectedZone)
    : wards;

  const getWardColor = (score: number) => {
    if (score >= 80) return "bg-pollution-good";
    if (score >= 60) return "bg-pollution-moderate";
    if (score >= 40) return "bg-pollution-unhealthy";
    if (score >= 20) return "bg-pollution-severe";
    return "bg-pollution-hazardous";
  };

  return (
    <div className="space-y-6">
      {/* Search and Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <WardSearch />
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Zone Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedZone === null ? "secondary" : "outline"}
          size="sm"
          onClick={() => setSelectedZone(null)}
        >
          All Zones
        </Button>
        {zones.map((zone: string) => (
          <Button
            key={zone}
            variant={selectedZone === zone ? "secondary" : "outline"}
            size="sm"
            onClick={() => setSelectedZone(zone)}
          >
            {zone}
          </Button>
        ))}
      </div>

      {/* Interactive Map Visualization */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                <MapIcon className="h-5 w-5 text-primary" />
                Delhi Ward Map
              </CardTitle>
              {/* Real-time data indicator */}
              <Badge variant={isUsingRealData ? "default" : "secondary"} className="flex items-center gap-1">
                {isLoading ? (
                  <><Loader2 className="h-3 w-3 animate-spin" /> Loading...</>
                ) : isUsingRealData ? (
                  <><Wifi className="h-3 w-3" /> Live Data</>
                ) : (
                  <><WifiOff className="h-3 w-3" /> Mock Data</>
                )}
              </Badge>
              {avgPM25 && (
                <Badge variant="outline" className="text-xs">
                  Avg PM2.5: {avgPM25} µg/m³
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={refetch} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button variant="ghost" size="icon">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {lastUpdated && (
            <div className="text-xs text-muted-foreground mt-1">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {/* Simplified Map Grid Representation */}
          <div className="relative bg-muted/20 p-6">
            <div className="grid grid-cols-10 md:grid-cols-16 lg:grid-cols-20 gap-1">
              {filteredWards.slice(0, 100).map((ward) => (
                <button
                  key={ward.id}
                  className={`
                    aspect-square rounded-sm transition-all duration-200 
                    ${getWardColor(ward.pollutionScore)}
                    hover:scale-110 hover:z-10 hover:shadow-lg
                    ${hoveredWard?.id === ward.id ? 'ring-2 ring-primary scale-110 z-10' : ''}
                    flex items-center justify-center text-white text-[8px] md:text-[10px] font-bold
                    shadow-sm
                  `}
                  onMouseEnter={() => setHoveredWard(ward)}
                  onMouseLeave={() => setHoveredWard(null)}
                  onClick={() => window.location.href = `/ward/${ward.id}`}
                  title={`Ward ${ward.id}: ${ward.name}`}
                >
                  {ward.id}
                </button>
              ))}
            </div>

            {/* Hovered Ward Info */}
            {hoveredWard && (
              <div className="absolute bottom-4 left-4 bg-card border rounded-lg p-3 shadow-lg animate-fade-in">
                <div className="font-semibold">Ward {hoveredWard.id}</div>
                <div className="text-sm text-muted-foreground">{hoveredWard.name}</div>
                <div className="text-sm text-muted-foreground">{hoveredWard.zone}</div>
                <div className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getWardColor(hoveredWard.pollutionScore)} text-white`}>
                  Score: {hoveredWard.pollutionScore}
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-pollution-good" />
                <span>Good (80+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-pollution-moderate" />
                <span>Moderate (60-79)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-pollution-unhealthy" />
                <span>Unhealthy (40-59)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-pollution-severe" />
                <span>Severe (20-39)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-pollution-hazardous" />
                <span>Hazardous (&lt;20)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ward Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-semibold">
            {selectedZone ? `${selectedZone} Wards` : 'All Wards'} ({filteredWards.length})
          </h3>
        </div>

        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          : "space-y-3"
        }>
          {filteredWards.slice(0, 12).map((ward) => (
            <WardCard key={ward.id} ward={ward} showDetails={viewMode === "grid"} />
          ))}
        </div>

        {filteredWards.length > 12 && (
          <div className="mt-6 text-center">
            <Button variant="civic-outline" size="lg">
              Load More Wards ({filteredWards.length - 12} remaining)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
