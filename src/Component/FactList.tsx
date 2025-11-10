import { useState, useEffect } from "react";
import { ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import FactComments from "./FactComments";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface SubmittedFact {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  votes: number;
  created_at: string;
}

const FactList = () => {
  const [facts, setFacts] = useState<SubmittedFact[]>([]);
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const { toast } = useToast();

  const loadFacts = async () => {
    const { data, error } = await supabase
      .from("submitted_facts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setFacts(data);
    }
  };

  const loadUserVotes = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("fact_votes")
      .select("fact_id")
      .eq("user_id", user.id);
    
    if (data) {
      setUserVotes(new Set(data.map(v => v.fact_id)));
    }
  };

  useEffect(() => {
    loadFacts();
    loadUserVotes();
    window.addEventListener("facts-updated", () => {
      loadFacts();
      loadUserVotes();
    });
    return () => window.removeEventListener("facts-updated", loadFacts);
  }, [user]);

  const handleVote = async (id: string) => {
    if (!user) {
      toast({
        title: "Login diperlukan",
        description: "Silakan login untuk memberikan vote",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase.rpc("toggle_fact_vote", {
      p_fact_id: id,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      loadFacts();
      loadUserVotes();
    }
  };

  if (facts.length === 0) {
    return (
      <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-8 border border-border card-glow text-center">
        <p className="text-muted-foreground">Belum ada fakta yang dikirim. Jadilah yang pertama berbagi!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {facts.map((fact) => (
        <div
          key={fact.id}
          className="bg-card/60 backdrop-blur-sm rounded-xl p-6 border border-border card-glow-hover"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">{fact.title}</h3>
              <p className="text-muted-foreground mb-4">{fact.content}</p>
              {fact.image_url && (
                <img
                  src={fact.image_url}
                  alt={fact.title}
                  className="w-full max-w-md rounded-lg border border-border mb-4"
                />
              )}
              <p className="text-xs text-muted-foreground mb-4">
                Dikirim {new Date(fact.created_at).toLocaleDateString('id-ID')}
              </p>
              
              <FactComments factId={fact.id} />
            </div>
            <Button
              onClick={() => handleVote(fact.id)}
              variant={userVotes.has(fact.id) ? "default" : "outline"}
              size="sm"
              className="flex-col gap-1 h-auto py-3 px-4"
            >
              <ThumbsUp className={`w-5 h-5 ${userVotes.has(fact.id) ? "fill-current" : ""}`} />
              <span className="text-lg font-bold">{fact.votes}</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FactList;
