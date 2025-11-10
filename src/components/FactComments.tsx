import { useState, useEffect } from "react";
import { MessageCircle, Image as ImageIcon, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { commentSchema, fileUploadSchema } from "@/lib/validations";
import { useAuth } from "@/hooks/useAuth";
import { v4 as uuidv4 } from "uuid";

interface Comment {
  id: string;
  fact_id: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

interface FactCommentsProps {
  factId: string;
}

const FactComments = ({ factId }: FactCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const loadComments = async () => {
    const { data, error } = await supabase
      .from("fact_comments")
      .select("*")
      .eq("fact_id", factId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setComments(data);
    }
  };

  useEffect(() => {
    loadComments();
  }, [factId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const validated = commentSchema.parse({ content });

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

      const { error } = await supabase.from("fact_comments").insert({
        fact_id: factId,
        content: validated.content,
        image_url: imageUrl,
        user_id: user.id,
      });

      if (error) throw error;

      toast.success("Komentar berhasil ditambahkan!");
      setContent("");
      setImage(null);
      setImagePreview("");
      setShowCommentForm(false);
      loadComments();
    } catch (error: any) {
      console.error("Error submitting comment:", error);
      toast.error(error.message || "Gagal mengirim komentar");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {comments.length} Komentar
          </span>
        </div>
        <Button
          onClick={() => setShowCommentForm(!showCommentForm)}
          variant="outline"
          size="sm"
          disabled={!user}
        >
          {showCommentForm ? "Tutup" : user ? "Balas" : "Login untuk komentar"}
        </Button>
      </div>

      {showCommentForm && user && (
        <div className="bg-muted/20 rounded-lg p-4 space-y-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tulis komentar..."
            className="bg-background/50 border-border"
          />

          <div>
            <label className="block text-sm font-medium mb-2">
              Gambar (PNG/JPG, Opsional, max 5MB)
            </label>
            <div className="flex items-center gap-3">
              <Input
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleImageChange}
                className="bg-background/50 border-border"
              />
              <ImageIcon className="w-5 h-5 text-muted-foreground" />
            </div>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Pratinjau"
                className="mt-3 w-32 h-32 object-cover rounded-lg border border-border"
              />
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full btn-earth"
          >
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? "Mengirim..." : "Kirim Komentar"}
          </Button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-muted/10 rounded-lg p-4 border border-border/50"
          >
            <p className="text-sm mb-2">{comment.content}</p>
            {comment.image_url && (
              <img
                src={comment.image_url}
                alt="Komentar"
                className="w-48 h-48 object-cover rounded-lg border border-border mb-2"
              />
            )}
            <p className="text-xs text-muted-foreground">
              {new Date(comment.created_at).toLocaleDateString("id-ID")} {new Date(comment.created_at).toLocaleTimeString("id-ID")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FactComments;
