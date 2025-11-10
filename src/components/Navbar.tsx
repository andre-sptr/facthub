import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, Gamepad2, Users, Bot, Trophy, LogOut, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? "bg-background/80 backdrop-blur-md border-b border-border shadow-xl" 
        : "bg-card/80 backdrop-blur-md border-b border-primary/20"
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Sparkles className={`w-6 h-6 transition-colors duration-300 ${scrolled ? 'text-primary' : 'glow-cyan'}`} />
            <span className={`text-2xl font-bold transition-all duration-300 ${scrolled ? 'text-foreground' : 'glow-cyan'}`}>
              FactHub
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive('/') 
                    ? 'bg-primary/30 text-primary' 
                    : scrolled 
                      ? 'hover:bg-primary/20 hover:text-primary text-foreground' 
                      : 'hover:bg-primary/20 hover:text-primary text-muted-foreground'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Beranda</span>
              </Link>

              <Link
                to="/choob"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive('/choob') 
                    ? 'bg-primary/30 text-primary' 
                    : scrolled 
                      ? 'hover:bg-primary/20 hover:text-primary text-foreground' 
                      : 'hover:bg-primary/20 hover:text-primary text-muted-foreground'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span className="hidden sm:inline">Choob AI</span>
              </Link>

              <Link
                to="/leaderboard"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive('/leaderboard') 
                    ? 'bg-secondary/30 text-secondary' 
                    : scrolled 
                      ? 'hover:bg-secondary/20 hover:text-secondary text-foreground' 
                      : 'hover:bg-secondary/20 hover:text-secondary text-muted-foreground'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span className="hidden sm:inline">Leaderboard</span>
              </Link>

              <Link
                to="/permainan"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive('/permainan') 
                    ? 'bg-secondary/30 text-secondary' 
                    : scrolled 
                      ? 'hover:bg-secondary/20 hover:text-secondary text-foreground' 
                      : 'hover:bg-secondary/20 hover:text-secondary text-muted-foreground'
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                <span className="hidden sm:inline">Permainan</span>
              </Link>

              <Link
                to="/tim"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive('/tim') 
                    ? 'bg-accent/30 text-accent' 
                    : scrolled 
                      ? 'hover:bg-accent/20 hover:text-accent text-foreground' 
                      : 'hover:bg-accent/20 hover:text-accent text-muted-foreground'
                }`}
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Tim</span>
              </Link>
            </div>

            <div className="flex items-center gap-3 border-l border-border/50 pl-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground hidden md:inline">
                    {user.email}
                  </span>
                  <Button
                    onClick={signOut}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Keluar</span>
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="default" size="sm" className="gap-2">
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Masuk</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
