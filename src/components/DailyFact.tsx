import { useState, useEffect } from "react";
import { ChevronRight, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const factsWithImages = [
  {
    text: "Indonesia memiliki lebih dari 17.000 pulau, menjadikannya negara kepulauan terbesar di dunia.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop",
    category: "alam"
  },
  {
    text: "Batik Indonesia telah diakui UNESCO sebagai Warisan Budaya Takbenda Manusia sejak 2009.",
    image: "https://images.unsplash.com/photo-1591184171710-50e5e4f6f8ae?w=800&auto=format&fit=crop",
    category: "budaya"
  },
  {
    text: "Pancasila sebagai dasar negara Indonesia pertama kali dirumuskan pada 1 Juni 1945 oleh Ir. Soekarno.",
    image: "https://images.unsplash.com/photo-1555992336-fb0d29afa4d6?w=800&auto=format&fit=crop",
    category: "politik"
  },
  {
    text: "Hampir 87% penduduk Indonesia adalah Muslim, menjadikannya negara dengan populasi Muslim terbesar di dunia.",
    image: "https://images.unsplash.com/photo-1564769610858-03d2a3cb1e8f?w=800&auto=format&fit=crop",
    category: "agama"
  },
  {
    text: "Candi Borobudur adalah candi Buddha terbesar di dunia dan dibangun pada abad ke-8.",
    image: "https://images.unsplash.com/photo-1598968543381-92f61d1c188a?w=800&auto=format&fit=crop",
    category: "budaya"
  },
  {
    text: "Indonesia adalah produsen kopi terbesar keempat di dunia, dengan kopi Luwak sebagai salah satu yang termahal.",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop",
    category: "lifestyle"
  },
  {
    text: "Gen Z di Indonesia (lahir 1997-2012) menyumbang sekitar 27% dari total populasi pada 2024.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop",
    category: "sosial"
  },
  {
    text: "Pada 2024, ekonomi digital Indonesia diprediksi mencapai nilai USD 146 miliar.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
    category: "lifestyle"
  },
  {
    text: "Tari Saman dari Aceh masuk dalam Daftar Representatif Budaya Takbenda Warisan Manusia UNESCO.",
    image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&auto=format&fit=crop",
    category: "budaya"
  },
  {
    text: "Hutan hujan tropis Indonesia adalah rumah bagi orangutan, harimau Sumatera, dan badak Jawa yang terancam punah.",
    image: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&auto=format&fit=crop",
    category: "alam"
  },
  {
    text: "Undang-Undang Dasar 1945 telah mengalami empat kali amandemen sejak era reformasi 1998-2002.",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop",
    category: "hukum"
  },
  {
    text: "Indonesia memiliki lebih dari 700 bahasa daerah yang masih digunakan hingga saat ini.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop",
    category: "budaya"
  },
  {
    text: "Gunung Semeru di Jawa Timur adalah gunung tertinggi di Pulau Jawa dengan ketinggian 3.676 mdpl.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
    category: "alam"
  },
  {
    text: "Di Indonesia, ada tradisi 'gotong royong' yang berarti kerja sama komunal untuk kepentingan bersama.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop",
    category: "sosial"
  },
  {
    text: "Lebih dari 100 juta orang di Indonesia menggunakan media sosial setiap hari pada tahun 2024.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop",
    category: "lifestyle"
  },
  {
    text: "Sistem presidensial Indonesia mengadopsi pemisahan kekuasaan antara eksekutif, legislatif, dan yudikatif.",
    image: "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?w=800&auto=format&fit=crop",
    category: "politik"
  },
  {
    text: "Wayang kulit Indonesia telah menjadi bagian dari budaya Jawa selama lebih dari 1000 tahun.",
    image: "https://images.unsplash.com/photo-1516450137517-162bfbeb8dba?w=800&auto=format&fit=crop",
    category: "budaya"
  },
  {
    text: "Pada 2024, tren 'slow living' dan mindfulness semakin populer di kalangan milenial dan Gen Z Indonesia.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop",
    category: "lifestyle"
  },
  {
    text: "Indonesia adalah anggota G20, ASEAN, dan negara berkembang dengan ekonomi terbesar di Asia Tenggara.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop",
    category: "politik"
  },
  {
    text: "Madu tidak pernah basi. Arkeolog menemukan madu berusia 3000 tahun di makam Mesir yang masih bisa dimakan!",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784abd?w=800&auto=format&fit=crop",
    category: "alam"
  },
  {
    text: "Hukum perkawinan di Indonesia mengakui berbagai sistem hukum: hukum adat, hukum agama, dan hukum negara.",
    image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&auto=format&fit=crop",
    category: "hukum"
  },
  {
    text: "Otak manusia menggunakan 20% energi tubuh meskipun hanya 2% dari berat tubuh.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&auto=format&fit=crop",
    category: "alam"
  },
];

const DailyFact = () => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  useEffect(() => {
    // Get fact based on day of year
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    setCurrentFactIndex(dayOfYear % factsWithImages.length);
  }, []);

  const handleNext = () => {
    setCurrentFactIndex((prev) => (prev + 1) % factsWithImages.length);
  };

  const handleSave = () => {
    const achievements = JSON.parse(localStorage.getItem("facthub-achievements") || "[]");
    const factToSave = {
      id: Date.now(),
      fact: factsWithImages[currentFactIndex].text,
      savedAt: new Date().toISOString(),
    };
    
    achievements.push(factToSave);
    localStorage.setItem("facthub-achievements", JSON.stringify(achievements));
    toast.success("Fakta berhasil disimpan!");
  };

  const currentFact = factsWithImages[currentFactIndex];

  return (
    <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-8 border border-border card-glow-hover">
      <h2 className="text-2xl font-bold mb-2 glow-cyan">✨ Fakta Menarik Hari Ini</h2>
      <p className="text-sm text-muted-foreground mb-6">Temukan sesuatu yang menakjubkan setiap hari</p>
      
      {currentFact.image && (
        <div className="mb-4 rounded-xl overflow-hidden">
          <img
            src={currentFact.image}
            alt="Ilustrasi fakta"
            className="w-full h-64 object-cover"
          />
        </div>
      )}

      <div className="bg-muted/30 rounded-xl p-6 mb-6 min-h-[120px] flex items-center">
        <p className="text-lg leading-relaxed">{currentFact.text}</p>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleNext} className="flex-1 btn-earth">
          Fakta Berikutnya
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
        <Button onClick={handleSave} variant="outline" className="flex-1">
          <Save className="w-4 h-4 mr-2" />
          Simpan
        </Button>
      </div>
    </div>
  );
};

export default DailyFact;
