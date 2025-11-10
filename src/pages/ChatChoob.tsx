import Navbar from "@/components/Navbar";
import StarField from "@/components/StarField";
import ChatChoob from "@/components/ChatChoob";

const ChatChoobPage = () => {
  return (
    <div className="min-h-screen relative">
      <StarField />
      <Navbar />
      
      <div className="relative z-10 min-h-screen flex items-center py-20">
        <div className="container mx-auto px-4 pt-20">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-5xl font-bold mb-4 glow-cyan">
              🤖 Chat dengan Choob AI
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tanya Choob tentang fakta menarik apapun! Dia siap membantu dengan pengetahuan yang luas.
            </p>
          </div>
          <div className="animate-scale-in">
            <ChatChoob />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatChoobPage;
