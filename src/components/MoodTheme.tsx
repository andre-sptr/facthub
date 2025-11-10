import { useState, useEffect } from "react";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

type MoodType = "forest" | "sunset" | "earth" | "stone";

const MoodTheme = () => {
  const [mood, setMood] = useState<MoodType>("earth");

  useEffect(() => {
    const savedMood = localStorage.getItem("facthub-mood") as MoodType;
    if (savedMood) {
      setMood(savedMood);
      applyMood(savedMood);
    }
  }, []);

  const applyMood = (newMood: MoodType) => {
    const root = document.documentElement;
    
    switch (newMood) {
      case "forest":
        root.style.setProperty("--primary", "140 35% 35%");
        root.style.setProperty("--secondary", "120 30% 40%");
        root.style.setProperty("--accent", "100 25% 45%");
        break;
      case "sunset":
        root.style.setProperty("--primary", "25 70% 60%");
        root.style.setProperty("--secondary", "15 65% 55%");
        root.style.setProperty("--accent", "35 60% 65%");
        break;
      case "earth":
        root.style.setProperty("--primary", "15 65% 55%");
        root.style.setProperty("--secondary", "130 25% 45%");
        root.style.setProperty("--accent", "40 35% 65%");
        break;
      case "stone":
        root.style.setProperty("--primary", "30 5% 60%");
        root.style.setProperty("--secondary", "30 8% 50%");
        root.style.setProperty("--accent", "30 10% 70%");
        break;
    }
  };

  const handleMoodChange = (newMood: MoodType) => {
    setMood(newMood);
    applyMood(newMood);
    localStorage.setItem("facthub-mood", newMood);
  };

  return (
    <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-border card-glow">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Tema Mood</h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Button
          variant={mood === "forest" ? "default" : "outline"}
          onClick={() => handleMoodChange("forest")}
          className="w-full"
        >
          🌲 Forest
        </Button>
        <Button
          variant={mood === "sunset" ? "default" : "outline"}
          onClick={() => handleMoodChange("sunset")}
          className="w-full"
        >
          🌅 Sunset
        </Button>
        <Button
          variant={mood === "earth" ? "default" : "outline"}
          onClick={() => handleMoodChange("earth")}
          className="w-full"
        >
          🌍 Earth
        </Button>
        <Button
          variant={mood === "stone" ? "default" : "outline"}
          onClick={() => handleMoodChange("stone")}
          className="w-full"
        >
          🪨 Stone
        </Button>
      </div>
    </div>
  );
};

export default MoodTheme;
