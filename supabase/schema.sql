-- AI Interview Analyzer Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  last_login_at TIMESTAMP WITH TIME ZONE,
  login_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interviews table
CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interview transcripts table
CREATE TABLE interview_transcripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  timestamp_ms INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interview analysis table
CREATE TABLE interview_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  interview_id UUID NOT NULL UNIQUE REFERENCES interviews(id) ON DELETE CASCADE,
  confidence_score DECIMAL(5,2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  speaking_pace_wpm DECIMAL(6,2) NOT NULL,
  filler_word_count INTEGER NOT NULL DEFAULT 0,
  filler_word_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  nervousness_score DECIMAL(5,2) NOT NULL CHECK (nervousness_score >= 0 AND nervousness_score <= 100),
  emotional_engagement_score DECIMAL(5,2) NOT NULL CHECK (emotional_engagement_score >= 0 AND emotional_engagement_score <= 100),
  total_words INTEGER NOT NULL DEFAULT 0,
  unique_words INTEGER NOT NULL DEFAULT 0,
  average_pause_duration_ms INTEGER,
  longest_pause_duration_ms INTEGER,
  analysis_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Filler words table
CREATE TABLE filler_words (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  timestamps INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_interviews_user_id ON interviews(user_id);
CREATE INDEX idx_interviews_status ON interviews(status);
CREATE INDEX idx_interviews_created_at ON interviews(created_at DESC);
CREATE INDEX idx_interview_transcripts_interview_id ON interview_transcripts(interview_id);
CREATE INDEX idx_interview_transcripts_timestamp ON interview_transcripts(timestamp_ms);
CREATE INDEX idx_interview_analysis_interview_id ON interview_analysis(interview_id);
CREATE INDEX idx_filler_words_interview_id ON filler_words(interview_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interviews_updated_at
  BEFORE UPDATE ON interviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interview_analysis_updated_at
  BEFORE UPDATE ON interview_analysis
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Comments for documentation
COMMENT ON TABLE profiles IS 'User profile information extending auth.users';
COMMENT ON TABLE interviews IS 'Mock interview sessions';
COMMENT ON TABLE interview_transcripts IS 'Real-time transcription data from interviews';
COMMENT ON TABLE interview_analysis IS 'Computed analysis metrics for completed interviews';
COMMENT ON TABLE filler_words IS 'Tracking of filler words used during interviews';

-- Function to increment login count
CREATE OR REPLACE FUNCTION increment_login_count(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE profiles
  SET login_count = COALESCE(login_count, 0) + 1
  WHERE id = user_id
  RETURNING login_count INTO new_count;
  
  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
