import { Link } from "react-router-dom";
import { Leaf, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-heading text-xl font-bold">CleanWard</span>
            </Link>
            <p className="text-sm text-muted-foreground font-body">
              Ward-Wise Pollution Awareness & Action Dashboard for Delhi. Empowering citizens and authorities to create cleaner wards.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-heading font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/map" className="hover:text-primary transition-colors">Ward Map</Link>
              </li>
              <li>
                <Link to="/citizen" className="hover:text-primary transition-colors">Citizen Dashboard</Link>
              </li>
              <li>
                <Link to="/authority" className="hover:text-primary transition-colors">Authority Portal</Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-primary transition-colors">Login / Register</Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-heading font-semibold">Get Involved</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors flex items-center gap-1">
                  Join as Volunteer <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors flex items-center gap-1">
                  Register Your NGO <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors flex items-center gap-1">
                  Partner with Municipality <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors flex items-center gap-1">
                  Contribute to the Cause <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-heading font-semibold">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Delhi Municipal Corporation
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                contact@cleanward.delhi.gov.in
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                1800-XXX-XXXX (Toll Free)
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2024 CleanWard - Government of NCT of Delhi. All rights reserved.</p>
          <p className="mt-1">
            An initiative under Swachh Bharat Mission | Data sourced from CPCB, DPCC & Municipal Records
          </p>
        </div>
      </div>
    </footer>
  );
}
