"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ThemeTestPage() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">
              🎨 Theme System Test
            </CardTitle>
            <p className="text-muted-foreground">
              Current theme:{" "}
              <span className="text-primary font-semibold">{theme}</span>
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme Buttons */}
            <div className="grid grid-cols-3 gap-3">
              {themes?.map((themeName) => (
                <Button
                  key={themeName}
                  onClick={() => setTheme(themeName)}
                  variant={theme === themeName ? "default" : "outline"}
                  className="capitalize"
                >
                  {themeName.replace("-", " ")}
                </Button>
              ))}
            </div>

            {/* Color Showcase */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-4">
                  <h3 className="font-semibold">Primary Color</h3>
                  <p className="text-sm opacity-90">
                    Primary background with foreground text
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-accent text-accent-foreground">
                <CardContent className="p-4">
                  <h3 className="font-semibold">Accent Color</h3>
                  <p className="text-sm opacity-90">
                    Accent background with foreground text
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Borders and Text */}
            <div className="p-4 border border-border rounded-lg">
              <h3 className="text-foreground font-semibold mb-2">
                Text Colors
              </h3>
              <p className="text-foreground mb-1">Foreground text</p>
              <p className="text-muted-foreground mb-1">
                Muted foreground text
              </p>
              <p className="text-destructive">Destructive text</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
