import { useState } from 'react';
import { Sparkles, BookOpen } from 'lucide-react';
import { ProfileForm, ProfileFormData } from './components/ProfileForm';
import { QuestionsList } from './components/QuestionsList';
import { QuestionBankManager } from './components/QuestionBankManager';
import { supabase, GeneratedQuestion } from './lib/supabase';
import { generateInterviewQuestions } from './lib/questionGenerator';

function App() {
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'manage'>('generate');

  const handleGenerateQuestions = async (formData: ProfileFormData) => {
    setIsGenerating(true);
    setGeneratedQuestions([]);

    try {
      const { data: profile, error: profileError } = await supabase
        .from('interview_profiles')
        .insert([
          {
            job_title: formData.jobTitle,
            job_description: formData.jobDescription,
            required_skills: formData.requiredSkills,
            linkedin_url: formData.linkedinUrl || null,
            github_url: formData.githubUrl || null,
            deployment_url: formData.deploymentUrl || null
          }
        ])
        .select()
        .single();

      if (profileError || !profile) {
        console.error('Error creating profile:', profileError);
        return;
      }

      const questions = await generateInterviewQuestions(
        {
          jobTitle: formData.jobTitle,
          jobDescription: formData.jobDescription,
          requiredSkills: formData.requiredSkills,
          roleType: formData.roleType
        },
        profile.id
      );

      setGeneratedQuestions(questions);
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              AI Interview Question Generator
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Generate custom technical and behavioral questions tailored to your intern job requirements
          </p>
        </div>

        <div className="mb-8 flex justify-center gap-2">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'generate'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Generate Questions
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'manage'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Manage Question Bank
          </button>
        </div>

        {activeTab === 'generate' ? (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 h-fit">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Job Profile
                </h2>
              </div>
              <ProfileForm
                onSubmit={handleGenerateQuestions}
                isGenerating={isGenerating}
              />
            </div>

            <div className="lg:sticky lg:top-8 h-fit">
              {isGenerating ? (
                <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-100 flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
                  <p className="text-gray-600 font-medium">Generating custom questions...</p>
                  <p className="text-gray-400 text-sm mt-2">Analyzing job requirements</p>
                </div>
              ) : generatedQuestions.length > 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                  <QuestionsList questions={generatedQuestions} />
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-100 text-center">
                  <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    Ready to Generate
                  </h3>
                  <p className="text-gray-600">
                    Fill out the job profile form to generate custom interview questions
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <QuestionBankManager />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
