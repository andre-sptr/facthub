-- Create user roles enum and table for proper authorization
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles without RLS recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger to create profile and assign default role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add user_id to submitted_facts
ALTER TABLE public.submitted_facts ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add user_id to fact_comments
ALTER TABLE public.fact_comments ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create fact_votes table to prevent vote manipulation
CREATE TABLE public.fact_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  fact_id UUID REFERENCES public.submitted_facts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, fact_id)
);

ALTER TABLE public.fact_votes ENABLE ROW LEVEL SECURITY;

-- Update submitted_facts RLS policies
DROP POLICY IF EXISTS "Anyone can submit facts" ON public.submitted_facts;
DROP POLICY IF EXISTS "Anyone can update votes" ON public.submitted_facts;

CREATE POLICY "Authenticated users can submit facts"
  ON public.submitted_facts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own facts"
  ON public.submitted_facts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Update fact_comments RLS policies
DROP POLICY IF EXISTS "Anyone can add comments" ON public.fact_comments;

CREATE POLICY "Authenticated users can add comments"
  ON public.fact_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- fact_votes policies
CREATE POLICY "Users can view all votes"
  ON public.fact_votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote once"
  ON public.fact_votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes"
  ON public.fact_votes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Update users table RLS
DROP POLICY IF EXISTS "Anyone can create user" ON public.users;
DROP POLICY IF EXISTS "Anyone can update points" ON public.users;

CREATE POLICY "Authenticated users can view all users"
  ON public.users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify users"
  ON public.users FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Function to handle voting with proper constraints
CREATE OR REPLACE FUNCTION public.toggle_fact_vote(p_fact_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_existing_vote UUID;
  v_new_vote_count INTEGER;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Check if vote exists
  SELECT id INTO v_existing_vote
  FROM public.fact_votes
  WHERE user_id = v_user_id AND fact_id = p_fact_id;
  
  IF v_existing_vote IS NOT NULL THEN
    -- Remove vote
    DELETE FROM public.fact_votes WHERE id = v_existing_vote;
    
    -- Decrement vote count
    UPDATE public.submitted_facts
    SET votes = GREATEST(votes - 1, 0)
    WHERE id = p_fact_id;
  ELSE
    -- Add vote
    INSERT INTO public.fact_votes (user_id, fact_id)
    VALUES (v_user_id, p_fact_id);
    
    -- Increment vote count
    UPDATE public.submitted_facts
    SET votes = votes + 1
    WHERE id = p_fact_id;
  END IF;
  
  -- Get updated vote count
  SELECT votes INTO v_new_vote_count
  FROM public.submitted_facts
  WHERE id = p_fact_id;
  
  RETURN json_build_object(
    'voted', v_existing_vote IS NULL,
    'votes', v_new_vote_count
  );
END;
$$;