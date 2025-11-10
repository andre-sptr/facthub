import { useState } from "react";
import { Upload, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { factSchema, fileUploadSchema } from "@/lib/validations";
import { useAuth } from "@/hooks/useAuth";
import { v4 as uuidv4 } from "uuid";

const FactSubmission = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      fileUploadSchema.parse({ size: file.size, type: file.type });
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || "File tidak valid");
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Silakan login terlebih dahulu");
      return;
    }

    try {
      const validated = factSchema.parse({ title, content });

      setIsSubmitting(true);
      let imageUrl = null;

      if (image) {
        const fileExt = image.name.split(".").pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("fact-images")
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("fact-images")
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const { error } = await supabase.from("submitted_facts").insert({
        title: validated.title,
        content: validated.content,
        image_url: imageUrl,
        user_id: user.id,
      });

      if (error) throw error;

      setTitle("");
      setContent("");
      setImage(null);
      setImagePreview("");
      toast.success("Fakta berhasil dikirim!");
      window.dispatchEvent(new Event("facts-updated"));
    } catch (error: any) {
      console.error("Error submitting fact:", error);
      toast.error(error.message || "Gagal mengirim fakta");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-8 border border-border card-glow">
      <h2 className="text-2xl font-bold mb-6 glow-purple">📝 Kirim Fakta Menarikmu</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Judul</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Masukkan judul yang menarik..."
            className="bg-muted/30 border-border"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Konten</label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Bagikan fakta menakjubkanmu..."
            className="bg-muted/30 border-border min-h-[120px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Gambar (PNG/JPG, Opsional, max 5MB)
          </label>
          <div className="flex items-center gap-3">
            <Input
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleImageUpload}
              className="bg-muted/30 border-border"
            />
            <Upload className="w-5 h-5 text-muted-foreground" />
          </div>
          {imagePreview && (
            <div className="mt-3">
              <img
                src={imagePreview}
                alt="Pratinjau"
                className="w-32 h-32 object-cover rounded-lg border border-border"
              />
            </div>
          )}
        </div>

        <Button onClick={handleSubmit} disabled={isSubmitting || !user} className="w-full btn-neon">
          <Send className="w-4 h-4 mr-2" />
          {isSubmitting ? "Mengirim..." : !user ? "Login untuk mengirim" : "Kirim Fakta"}
        </Button>
      </div>
    </div>
  );
};

export default FactSubmission;
