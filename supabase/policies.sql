-- Row Level Security Policies for AI Interview Analyzer

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE filler_words ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Interviews policies
CREATE POLICY "Users can view their own interviews"
  ON interviews FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own interviews"
  ON interviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interviews"
  ON interviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interviews"
  ON interviews FOR DELETE
  USING (auth.uid() = user_id);

-- Interview transcripts policies
CREATE POLICY "Users can view transcripts of their interviews"
  ON interview_transcripts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM interviews
      WHERE interviews.id = interview_transcripts.interview_id
      AND interviews.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert transcripts for their interviews"
  ON interview_transcripts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM interviews
      WHERE interviews.id = interview_transcripts.interview_id
      AND interviews.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete transcripts of their interviews"
  ON interview_transcripts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM interviews
      WHERE interviews.id = interview_transcripts.interview_id
      AND interviews.user_id = auth.uid()
    )
  );

-- Interview analysis policies
CREATE POLICY "Users can view analysis of their interviews"
  ON interview_analysis FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM interviews
      WHERE interviews.id = interview_analysis.interview_id
      AND interviews.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert analysis for their interviews"
  ON interview_analysis FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM interviews
      WHERE interviews.id = interview_analysis.interview_id
      AND interviews.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update analysis of their interviews"
  ON interview_analysis FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM interviews
      WHERE interviews.id = interview_analysis.interview_id
      AND interviews.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete analysis of their interviews"
  ON interview_analysis FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM interviews
      WHERE interviews.id = interview_analysis.interview_id
      AND interviews.user_id = auth.uid()
    )
  );

-- Filler words policies
CREATE POLICY "Users can view filler words of their interviews"
  ON filler_words FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM interviews
      WHERE interviews.id = filler_words.interview_id
      AND interviews.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert filler words for their interviews"
  ON filler_words FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM interviews
      WHERE interviews.id = filler_words.interview_id
      AND interviews.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update filler words of their interviews"
  ON filler_words FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM interviews
      WHERE interviews.id = filler_words.interview_id
      AND interviews.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete filler words of their interviews"
  ON filler_words FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM interviews
      WHERE interviews.id = filler_words.interview_id
      AND interviews.user_id = auth.uid()
    )
  );
