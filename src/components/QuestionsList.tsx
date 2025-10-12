import { GeneratedQuestion } from '../lib/supabase';
import { MessageSquare, Brain, TrendingUp, Info } from 'lucide-react';

interface QuestionsListProps {
  questions: GeneratedQuestion[];
}

export function QuestionsList({ questions }: QuestionsListProps) {
  const technical = questions.filter(q => q.category === 'Technical');
  const behavioral = questions.filter(q => q.category === 'Behavioral');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const QuestionCard = ({ question }: { question: GeneratedQuestion }) => (
    <div className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="text-gray-800 font-medium flex-1">{question.question}</p>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getDifficultyColor(question.difficulty)}`}>
          {question.difficulty}
        </span>
      </div>
      {question.reasoning && (
        <div className="flex items-start gap-2 mt-3 pt-3 border-t border-gray-100">
          <Info className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600">{question.reasoning}</p>
        </div>
      )}
    </div>
  );

  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            Generated Interview Questions
          </h2>
        </div>
        <p className="text-gray-600 text-sm">
          {questions.length} custom questions tailored to your job requirements
        </p>
      </div>

      {technical.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Technical Questions ({technical.length})
            </h3>
          </div>
          <div className="space-y-3">
            {technical.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        </div>
      )}

      {behavioral.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Behavioral Questions ({behavioral.length})
            </h3>
          </div>
          <div className="space-y-3">
            {behavioral.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
