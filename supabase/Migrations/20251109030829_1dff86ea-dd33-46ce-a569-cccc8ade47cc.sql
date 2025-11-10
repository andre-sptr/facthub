-- Create users table for leaderboard
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username text NOT NULL UNIQUE,
  points integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users are viewable by everyone" 
ON public.users 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create user" 
ON public.users 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update points" 
ON public.users 
FOR UPDATE 
USING (true);

-- Create index for leaderboard queries
CREATE INDEX idx_users_points ON public.users(points DESC);