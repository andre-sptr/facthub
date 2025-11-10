import Navbar from "@/components/Navbar";
import StarField from "@/components/StarField";
import DailyFact from "@/components/DailyFact";
import FactSubmission from "@/components/FactSubmission";
import FactList from "@/components/FactList";
import Leaderboard from "@/components/Leaderboard";
import MoodTheme from "@/components/MoodTheme";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <StarField />
      <Navbar />
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-6xl font-bold mb-4 glow-cyan animate-scale-in">
              ✨ FactHub
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Dosis harian fakta menakjubkan. Temukan, bagikan, dan jelajahi
              pengetahuan menarik dari seluruh alam semesta.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="lg:col-span-2 space-y-8">
              <DailyFact />
              <FactSubmission />
            </div>
            
            <div className="space-y-8">
              <Leaderboard />
              <MoodTheme />
            </div>
          </div>

          {/* Submitted Facts Section */}
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-3xl font-bold mb-6 glow-purple">
              🌟 Fakta Komunitas
            </h2>
            <FactList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
