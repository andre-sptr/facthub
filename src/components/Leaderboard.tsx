import { useState, useEffect } from "react";
import { Trophy, Medal, Award } from "lucide-react";

interface SubmittedFact {
  id: number;
  title: string;
  votes: number;
  submittedAt: string;
}

const Leaderboard = () => {
  const [topFacts, setTopFacts] = useState<SubmittedFact[]>([]);

  useEffect(() => {
    const loadLeaderboard = () => {
      const submissions: SubmittedFact[] = JSON.parse(
        localStorage.getItem("facthub-submissions") || "[]"
      );

      // Filter last 7 days
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const weeklyFacts = submissions
        .filter((fact) => new Date(fact.submittedAt) > weekAgo)
        .sort((a, b) => b.votes - a.votes)
        .slice(0, 3);

      setTopFacts(weeklyFacts);
    };

    loadLeaderboard();
    window.addEventListener("facts-updated", loadLeaderboard);
    return () => window.removeEventListener("facts-updated", loadLeaderboard);
  }, []);

  const getIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-700" />;
      default:
        return null;
    }
  };

  if (topFacts.length === 0) {
    return (
      <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-8 border border-border card-glow text-center">
        <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Belum ada data papan peringkat minggu ini</p>
      </div>
    );
  }

  return (
    <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-8 border border-border card-glow">
      <h2 className="text-2xl font-bold mb-6 glow-pink flex items-center gap-2">
        <Trophy className="w-6 h-6" />
        Papan Peringkat Mingguan
      </h2>

      <div className="space-y-4">
        {topFacts.map((fact, index) => (
          <div
            key={fact.id}
            className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl"
          >
            <div className="flex-shrink-0">{getIcon(index)}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{fact.title}</p>
              <p className="text-sm text-muted-foreground">
                {fact.votes} suara
              </p>
            </div>
            <div className="text-2xl font-bold text-primary">
              #{index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
