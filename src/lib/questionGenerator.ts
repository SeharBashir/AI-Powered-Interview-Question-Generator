import { supabase, QuestionBank, GeneratedQuestion } from './supabase';

interface GenerationParams {
  jobTitle: string;
  jobDescription: string;
  requiredSkills: string[];
  roleType: string;
}

export async function generateInterviewQuestions(
  params: GenerationParams,
  profileId: string
): Promise<GeneratedQuestion[]> {
  const { jobTitle, jobDescription, requiredSkills, roleType } = params;

  const { data: questionBank, error } = await supabase
    .from('question_banks')
    .select('*')
    .or(`role_type.eq.${roleType},role_type.eq.All`);

  if (error) {
    console.error('Error fetching question bank:', error);
    return [];
  }

  const generatedQuestions: Omit<GeneratedQuestion, 'id' | 'created_at'>[] = [];

  const technicalQuestions = questionBank?.filter(q => q.category === 'Technical') || [];
  const behavioralQuestions = questionBank?.filter(q => q.category === 'Behavioral') || [];

  const skillKeywords = requiredSkills.map(s => s.toLowerCase());
  const descriptionLower = jobDescription.toLowerCase();
  const titleLower = jobTitle.toLowerCase();

  const relevantTechnical = technicalQuestions.filter(q => {
    const questionLower = q.question.toLowerCase();
    const subcategoryLower = (q.subcategory || '').toLowerCase();

    return skillKeywords.some(skill =>
      questionLower.includes(skill) ||
      subcategoryLower.includes(skill) ||
      descriptionLower.includes(skill)
    );
  });

  const selectedTechnical = relevantTechnical.length >= 5
    ? relevantTechnical.slice(0, 5)
    : [...relevantTechnical, ...technicalQuestions.filter(q => !relevantTechnical.includes(q))].slice(0, 5);

  selectedTechnical.forEach(q => {
    const matchedSkills = skillKeywords.filter(skill =>
      q.question.toLowerCase().includes(skill) ||
      (q.subcategory || '').toLowerCase().includes(skill)
    );

    generatedQuestions.push({
      profile_id: profileId,
      question: q.question,
      category: q.category,
      difficulty: q.difficulty,
      reasoning: matchedSkills.length > 0
        ? `Matches required skills: ${matchedSkills.join(', ')}`
        : `Relevant for ${roleType} role`
    });
  });

  const selectedBehavioral = behavioralQuestions
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  selectedBehavioral.forEach(q => {
    generatedQuestions.push({
      profile_id: profileId,
      question: q.question,
      category: q.category,
      difficulty: q.difficulty,
      reasoning: `Essential behavioral assessment for ${jobTitle} position`
    });
  });

  if (generatedQuestions.length > 0) {
    const { data: insertedQuestions, error: insertError } = await supabase
      .from('generated_questions')
      .insert(generatedQuestions)
      .select();

    if (insertError) {
      console.error('Error inserting generated questions:', insertError);
      return [];
    }

    return insertedQuestions || [];
  }

  return [];
}

export function categorizeQuestions(questions: GeneratedQuestion[]) {
  const technical = questions.filter(q => q.category === 'Technical');
  const behavioral = questions.filter(q => q.category === 'Behavioral');

  return { technical, behavioral };
}
