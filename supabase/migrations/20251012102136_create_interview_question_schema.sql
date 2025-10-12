/*
  # Interview Question Generator Schema

  1. New Tables
    - `question_banks`
      - `id` (uuid, primary key)
      - `category` (text) - Technical, Behavioral, etc.
      - `subcategory` (text) - Programming, Communication, etc.
      - `question` (text) - The interview question
      - `difficulty` (text) - Easy, Medium, Hard
      - `role_type` (text) - Software Engineering, Data Science, etc.
      - `created_at` (timestamptz)
    
    - `interview_profiles`
      - `id` (uuid, primary key)
      - `job_title` (text) - Intern position title
      - `job_description` (text) - Full job description
      - `required_skills` (text[]) - Array of required skills
      - `linkedin_url` (text, optional) - LinkedIn post URL
      - `github_url` (text, optional) - GitHub repo URL
      - `deployment_url` (text, optional) - Live deployment URL
      - `created_at` (timestamptz)
    
    - `generated_questions`
      - `id` (uuid, primary key)
      - `profile_id` (uuid) - References interview_profiles
      - `question` (text) - Generated question
      - `category` (text) - Question category
      - `difficulty` (text) - Question difficulty
      - `reasoning` (text) - Why this question was generated
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS question_banks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  subcategory text,
  question text NOT NULL,
  difficulty text NOT NULL DEFAULT 'Medium',
  role_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS interview_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_title text NOT NULL,
  job_description text NOT NULL,
  required_skills text[] DEFAULT '{}',
  linkedin_url text,
  github_url text,
  deployment_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS generated_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES interview_profiles(id) ON DELETE CASCADE,
  question text NOT NULL,
  category text NOT NULL,
  difficulty text NOT NULL,
  reasoning text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE question_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view question banks"
  ON question_banks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert question banks"
  ON question_banks FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view interview profiles"
  ON interview_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert interview profiles"
  ON interview_profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update interview profiles"
  ON interview_profiles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete interview profiles"
  ON interview_profiles FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view generated questions"
  ON generated_questions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert generated questions"
  ON generated_questions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can delete generated questions"
  ON generated_questions FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample question bank data
INSERT INTO question_banks (category, subcategory, question, difficulty, role_type) VALUES
('Technical', 'Programming', 'Explain the difference between let, const, and var in JavaScript.', 'Easy', 'Software Engineering'),
('Technical', 'Programming', 'What is the time complexity of binary search?', 'Easy', 'Software Engineering'),
('Technical', 'Programming', 'Implement a function to reverse a linked list.', 'Medium', 'Software Engineering'),
('Technical', 'Programming', 'Explain the concept of closures in JavaScript with an example.', 'Medium', 'Software Engineering'),
('Technical', 'Data Structures', 'What is the difference between a stack and a queue?', 'Easy', 'Software Engineering'),
('Technical', 'Data Structures', 'Implement a function to detect a cycle in a linked list.', 'Hard', 'Software Engineering'),
('Technical', 'Algorithms', 'Explain how quicksort works and its time complexity.', 'Medium', 'Software Engineering'),
('Technical', 'Database', 'What is the difference between SQL and NoSQL databases?', 'Easy', 'Software Engineering'),
('Technical', 'Web Development', 'Explain the difference between REST and GraphQL APIs.', 'Medium', 'Software Engineering'),
('Technical', 'System Design', 'How would you design a URL shortening service?', 'Hard', 'Software Engineering'),
('Behavioral', 'Teamwork', 'Tell me about a time when you had to work with a difficult team member.', 'Medium', 'All'),
('Behavioral', 'Problem Solving', 'Describe a challenging technical problem you solved recently.', 'Medium', 'All'),
('Behavioral', 'Leadership', 'Give an example of when you took initiative on a project.', 'Medium', 'All'),
('Behavioral', 'Communication', 'How do you explain technical concepts to non-technical stakeholders?', 'Medium', 'All'),
('Behavioral', 'Time Management', 'Tell me about a time when you had to manage multiple deadlines.', 'Easy', 'All'),
('Behavioral', 'Learning', 'Describe a new technology or skill you learned recently. How did you approach it?', 'Easy', 'All'),
('Behavioral', 'Conflict Resolution', 'Tell me about a disagreement you had with a colleague and how you resolved it.', 'Hard', 'All'),
('Technical', 'Machine Learning', 'Explain the difference between supervised and unsupervised learning.', 'Easy', 'Data Science'),
('Technical', 'Machine Learning', 'What is overfitting and how can you prevent it?', 'Medium', 'Data Science'),
('Technical', 'Statistics', 'Explain the difference between correlation and causation.', 'Easy', 'Data Science');