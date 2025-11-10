-- Create facts table to store daily facts with images
CREATE TABLE public.facts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create submitted_facts table for user submissions
CREATE TABLE public.submitted_facts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  votes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submitted_facts ENABLE ROW LEVEL SECURITY;

-- Create policies for facts (public read access)
CREATE POLICY "Facts are viewable by everyone"
ON public.facts
FOR SELECT
USING (true);

-- Create policies for submitted_facts (public read and insert, no user required)
CREATE POLICY "Submitted facts are viewable by everyone"
ON public.submitted_facts
FOR SELECT
USING (true);

CREATE POLICY "Anyone can submit facts"
ON public.submitted_facts
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update votes"
ON public.submitted_facts
FOR UPDATE
USING (true);

-- Create comments table for fact comments with image support
CREATE TABLE public.fact_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fact_id UUID NOT NULL REFERENCES public.submitted_facts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on comments
ALTER TABLE public.fact_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for comments (public access)
CREATE POLICY "Comments are viewable by everyone"
ON public.fact_comments
FOR SELECT
USING (true);

CREATE POLICY "Anyone can add comments"
ON public.fact_comments
FOR INSERT
WITH CHECK (true);

-- Create storage bucket for fact images
INSERT INTO storage.buckets (id, name, public)
VALUES ('fact-images', 'fact-images', true);

-- Create storage policies for fact images
CREATE POLICY "Anyone can view fact images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'fact-images');

CREATE POLICY "Anyone can upload fact images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'fact-images');

CREATE POLICY "Anyone can update fact images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'fact-images');