import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PollutionScore, TrendIndicator } from "@/components/PollutionScore";
import { Ward } from "@/types";
import { getStatusFromScore } from "@/data/wards";
import { MapPin, Users, Ruler, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WardCardProps {
  ward: Ward;
  showDetails?: boolean;
}

export function WardCard({ ward, showDetails = true }: WardCardProps) {
  const navigate = useNavigate();
  const status = getStatusFromScore(ward.pollutionScore);

  return (
    <Card 
      variant="civic" 
      className="hover:shadow-lg transition-all cursor-pointer group"
      onClick={() => navigate(`/ward/${ward.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              Ward {ward.id}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {ward.name}
            </CardDescription>
          </div>
          <PollutionScore score={ward.pollutionScore} size="sm" showLabel={false} />
        </div>
        <Badge variant="outline" className="w-fit mt-2">
          {ward.zone}
        </Badge>
      </CardHeader>

      {showDetails && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{ward.population.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Ruler className="h-4 w-4" />
              <span>{ward.area} sq km</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {ward.sources.slice(0, 2).map((source) => (
              <Badge key={source} variant="secondary" className="text-xs">
                {source}
              </Badge>
            ))}
            {ward.sources.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{ward.sources.length - 2} more
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <TrendIndicator value={ward.trend7Days} label="7 days" />
            <Button variant="ghost" size="sm" className="gap-1">
              View Details
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
