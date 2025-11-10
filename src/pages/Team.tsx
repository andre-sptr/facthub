import Navbar from "@/components/Navbar";
import StarField from "@/components/StarField";
import { Instagram, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const teamMembers = [
  {
    name: "Zahra Dzakiyah Gunawan",
    role: "UX Assistant",
    instagram: "https://instagram.com/zahradzakya",
    icon: "🍃",
    color: "from-earth-moss to-earth-sage",
  },
  {
    name: "Mazaya Syifa Alifa",
    role: "Community Manager",
    instagram: "https://instagram.com/mazayaalifa",
    icon: "🌾",
    color: "from-earth-terracotta to-earth-sand",
  },
  {
    name: "Insyanifa Syafwah",
    role: "Content Researcher",
    instagram: "https://instagram.com/insynfasyfwh__",
    icon: "🌿",
    color: "from-earth-clay to-earth-terracotta",
  },
  {
    name: "Wafiq Khairunnisa",
    role: "Visual Designer",
    instagram: "https://instagram.com/wafiq.khai_09",
    icon: "🎨",
    color: "from-earth-sage to-earth-moss",
  },
];

const Team = () => {
  return (
    <div className="min-h-screen relative">
      <StarField />
      <Navbar />
      
      <div className="relative z-10 min-h-screen py-20">
        <div className="container mx-auto px-4 pt-20">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl font-bold mb-4 glow-cyan text-center animate-fade-in">
              👥 Tim Kami
            </h1>
            <p className="text-muted-foreground text-center mb-12 text-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Kenali orang-orang luar biasa di balik FactHub
            </p>

            {/* Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {teamMembers.map((member, index) => (
                <div
                  key={member.name}
                  className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-border card-glow-hover text-center animate-scale-in"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  {/* Avatar with gradient */}
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <div
                      className={`w-full h-full rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-6xl shadow-lg`}
                    >
                      {member.icon}
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-earth-moss/30 to-earth-terracotta/30 blur-xl animate-pulse"></div>
                  </div>

                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-sm text-primary font-semibold mb-4">
                    {member.role}
                  </p>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open(member.instagram, "_blank")}
                  >
                    <Instagram className="w-4 h-4 mr-2" />
                    Ikuti
                  </Button>
                </div>
              ))}
            </div>

            {/* AI Sidekick Card */}
            <div className="bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-2xl p-8 border border-primary/30 card-glow text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="relative w-40 h-40 mx-auto mb-6">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center text-6xl">
                  🤖
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 blur-2xl animate-pulse"></div>
              </div>

              <h2 className="text-3xl font-bold mb-2 glow-cyan flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6" />
                Choob
                <Sparkles className="w-6 h-6" />
              </h2>
              <p className="text-xl text-secondary font-semibold mb-3">
                AI Sidekick
              </p>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Pendamping cerdas Anda dalam perjalanan FactHub. Choob membantu menghasilkan
                fakta harian, menjalankan mini game, dan memastikan setiap interaksi
                lancar dan ajaib. Selalu belajar, selalu membantu! 🚀
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
