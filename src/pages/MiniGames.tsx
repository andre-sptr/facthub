import Navbar from "@/components/Navbar";
import StarField from "@/components/StarField";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ChevronRight, BarChart3 } from "lucide-react";

const elements = [
  { symbol: "H", name: "Hydrogen" },
  { symbol: "He", name: "Helium" },
  { symbol: "O", name: "Oxygen" },
  { symbol: "C", name: "Carbon" },
  { symbol: "N", name: "Nitrogen" },
  { symbol: "Fe", name: "Iron" },
  { symbol: "Au", name: "Gold" },
  { symbol: "Ag", name: "Silver" },
];

const countries = [
  { name: "France", capital: "Paris" },
  { name: "Japan", capital: "Tokyo" },
  { name: "Brazil", capital: "Brasília" },
  { name: "Egypt", capital: "Cairo" },
  { name: "Australia", capital: "Canberra" },
  { name: "Canada", capital: "Ottawa" },
  { name: "Indonesia", capital: "Jakarta" },
];

const languages = [
  { phrase: "Bonjour", language: "French" },
  { phrase: "Hola", language: "Spanish" },
  { phrase: "こんにちは", language: "Japanese" },
  { phrase: "Ciao", language: "Italian" },
  { phrase: "Hallo", language: "German" },
  { phrase: "Olá", language: "Portuguese" },
  { phrase: "Привет", language: "Russian" },
];

type GameType = "element" | "country" | "language";

const MiniGames = () => {
  const [activeGame, setActiveGame] = useState<GameType>("element");
  const [answer, setAnswer] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [stats, setStats] = useState({ plays: 0, wins: 0 });

  useEffect(() => {
    const savedStats = localStorage.getItem(`facthub-game-${activeGame}`);
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    } else {
      setStats({ plays: 0, wins: 0 });
    }
  }, [activeGame]);

  const getCurrentData = () => {
    switch (activeGame) {
      case "element":
        return elements[currentQuestion % elements.length];
      case "country":
        return countries[currentQuestion % countries.length];
      case "language":
        return languages[currentQuestion % languages.length];
    }
  };

  const handleCheck = () => {
    const data = getCurrentData();
    let correctAnswer = "";
    
    if (activeGame === "element" && "name" in data) {
      correctAnswer = data.name;
    } else if (activeGame === "country" && "name" in data) {
      correctAnswer = data.name;
    } else if (activeGame === "language" && "language" in data) {
      correctAnswer = data.language;
    }

    const newStats = { ...stats, plays: stats.plays + 1 };

    if (answer.toLowerCase().trim() === correctAnswer.toLowerCase()) {
      newStats.wins += 1;
      toast.success("Benar! 🎉");
    } else {
      toast.error(`Salah! Jawabannya adalah: ${correctAnswer}`);
    }

    setStats(newStats);
    localStorage.setItem(`facthub-game-${activeGame}`, JSON.stringify(newStats));
    setAnswer("");
  };

  const handleNext = () => {
    setCurrentQuestion((prev) => prev + 1);
    setAnswer("");
  };

  const renderQuestion = () => {
    const data = getCurrentData();
    
    if (activeGame === "element" && "symbol" in data) {
      return (
        <div>
          <p className="text-lg mb-2">Unsur apa yang memiliki simbol:</p>
          <div className="text-6xl font-bold text-primary glow-cyan mb-6">
            {data.symbol}
          </div>
        </div>
      );
    } else if (activeGame === "country" && "capital" in data) {
      return (
        <div>
          <p className="text-lg mb-2">Negara mana yang memiliki ibu kota:</p>
          <div className="text-4xl font-bold text-secondary glow-purple mb-6">
            {data.capital}
          </div>
        </div>
      );
    } else if (activeGame === "language" && "phrase" in data) {
      return (
        <div>
          <p className="text-lg mb-2">Bahasa apa frasa ini:</p>
          <div className="text-4xl font-bold text-accent glow-pink mb-6">
            {data.phrase}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen relative">
      <StarField />
      <Navbar />
      
      <div className="relative z-10 min-h-screen py-20">
        <div className="container mx-auto px-4 pt-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-4 glow-cyan text-center animate-fade-in">
              🎮 Mini Game
            </h1>
            <p className="text-muted-foreground text-center mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Uji pengetahuanmu dengan game edukatif yang menyenangkan
            </p>

            {/* Game Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <Button
                variant={activeGame === "element" ? "default" : "outline"}
                onClick={() => {
                  setActiveGame("element");
                  setCurrentQuestion(0);
                  setAnswer("");
                }}
                className="h-auto py-4"
              >
                <div>
                  <div className="font-bold mb-1">🧪 Unsur</div>
                  <div className="text-xs opacity-80">Tebak dari simbol</div>
                </div>
              </Button>
              <Button
                variant={activeGame === "country" ? "default" : "outline"}
                onClick={() => {
                  setActiveGame("country");
                  setCurrentQuestion(0);
                  setAnswer("");
                }}
                className="h-auto py-4"
              >
                <div>
                  <div className="font-bold mb-1">🌍 Negara</div>
                  <div className="text-xs opacity-80">Tebak dari ibu kota</div>
                </div>
              </Button>
              <Button
                variant={activeGame === "language" ? "default" : "outline"}
                onClick={() => {
                  setActiveGame("language");
                  setCurrentQuestion(0);
                  setAnswer("");
                }}
                className="h-auto py-4"
              >
                <div>
                  <div className="font-bold mb-1">🗣️ Bahasa</div>
                  <div className="text-xs opacity-80">Tebak dari frasa</div>
                </div>
              </Button>
            </div>

            {/* Game Area */}
            <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-8 border border-border card-glow mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-center mb-8">{renderQuestion()}</div>

              <div className="space-y-4">
                <Input
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleCheck()}
                  placeholder="Ketik jawabanmu..."
                  className="bg-muted/30 border-border text-center text-lg"
                />

                <div className="flex gap-3">
                  <Button onClick={handleCheck} className="flex-1 btn-neon">
                    Cek Jawaban
                  </Button>
                  <Button onClick={handleNext} variant="outline" className="flex-1">
                    Berikutnya
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-border card-glow animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Statistikmu</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-muted/30 rounded-xl p-4">
                  <div className="text-3xl font-bold text-primary">{stats.plays}</div>
                  <div className="text-sm text-muted-foreground">Total Main</div>
                </div>
                <div className="bg-muted/30 rounded-xl p-4">
                  <div className="text-3xl font-bold text-secondary">{stats.wins}</div>
                  <div className="text-sm text-muted-foreground">Menang</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniGames;
