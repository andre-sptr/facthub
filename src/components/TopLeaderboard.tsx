import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";

const TopLeaderboard = () => {
  const { data: topUsers, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("points", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  const getIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-orange-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center font-bold text-muted-foreground">{index + 1}</span>;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30";
      case 1:
        return "from-gray-400/20 to-gray-500/20 border-gray-400/30";
      case 2:
        return "from-orange-500/20 to-orange-600/20 border-orange-500/30";
      default:
        return "from-primary/10 to-secondary/10 border-primary/20";
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <h2 className="text-2xl font-bold text-center mb-6 text-primary">
          🏆 Top 5 Leaderboard
        </h2>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      <h2 className="text-2xl font-bold text-center mb-6 text-primary">
        🏆 Top 5 Leaderboard
      </h2>
      <div className="space-y-3">
        {topUsers && topUsers.length > 0 ? (
          topUsers.map((user, index) => (
            <div
              key={user.id}
              className={`flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r ${getRankColor(index)} border transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex-shrink-0">{getIcon(index)}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{user.username}</p>
                <p className="text-sm text-muted-foreground">
                  Bergabung: {new Date(user.created_at).toLocaleDateString('id-ID')}
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold text-primary">{user.points}</span>
                <span className="text-sm text-muted-foreground ml-1">poin</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Belum ada pengguna di leaderboard</p>
            <p className="text-sm mt-2">Jadilah yang pertama!</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TopLeaderboard;
