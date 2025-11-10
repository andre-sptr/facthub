import Navbar from "@/components/Navbar";
import StarField from "@/components/StarField";
import TopLeaderboard from "@/components/TopLeaderboard";

const LeaderboardPage = () => {
  return (
    <div className="min-h-screen relative">
      <StarField />
      <Navbar />
      
      <div className="relative z-10 min-h-screen flex items-center py-20">
        <div className="container mx-auto px-4 pt-20">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-5xl font-bold mb-4 glow-purple">
              🏆 Papan Peringkat
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Lihat pengguna teratas dengan poin terbanyak!
            </p>
          </div>
          <div className="animate-scale-in">
            <TopLeaderboard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
