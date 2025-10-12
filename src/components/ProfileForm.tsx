import { useState } from 'react';
import { Briefcase, FileText, Link as LinkIcon, Github, Globe, Plus, X } from 'lucide-react';

interface ProfileFormProps {
  onSubmit: (data: ProfileFormData) => void;
  isGenerating: boolean;
}

export interface ProfileFormData {
  jobTitle: string;
  jobDescription: string;
  requiredSkills: string[];
  linkedinUrl: string;
  githubUrl: string;
  deploymentUrl: string;
  roleType: string;
}

export function ProfileForm({ onSubmit, isGenerating }: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
    jobTitle: '',
    jobDescription: '',
    requiredSkills: [],
    linkedinUrl: '',
    githubUrl: '',
    deploymentUrl: '',
    roleType: 'Software Engineering'
  });

  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.requiredSkills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        requiredSkills: [...formData.requiredSkills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills.filter(s => s !== skill)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.jobTitle && formData.jobDescription && formData.requiredSkills.length > 0) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Briefcase className="w-4 h-4" />
          Job Title
        </label>
        <input
          type="text"
          value={formData.jobTitle}
          onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
          placeholder="e.g., Software Engineering Intern"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          required
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <FileText className="w-4 h-4" />
          Role Type
        </label>
        <select
          value={formData.roleType}
          onChange={(e) => setFormData({ ...formData, roleType: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        >
          <option value="Software Engineering">Software Engineering</option>
          <option value="Data Science">Data Science</option>
          <option value="All">General/Other</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <FileText className="w-4 h-4" />
          Job Description
        </label>
        <textarea
          value={formData.jobDescription}
          onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
          placeholder="Enter the full job description..."
          rows={6}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
          required
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Plus className="w-4 h-4" />
          Required Skills
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
            placeholder="e.g., JavaScript, React, Python"
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.requiredSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="hover:text-blue-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        {formData.requiredSkills.length === 0 && (
          <p className="text-sm text-gray-500 mt-2">Add at least one required skill</p>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700">Optional Links</h3>

        <div>
          <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <LinkIcon className="w-4 h-4" />
            LinkedIn Post URL
          </label>
          <input
            type="url"
            value={formData.linkedinUrl}
            onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
            placeholder="Enter LinkedIn post URL"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Github className="w-4 h-4" />
            GitHub Repository URL
          </label>
          <input
            type="url"
            value={formData.githubUrl}
            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            placeholder="Enter GitHub repo URL"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Globe className="w-4 h-4" />
            Live Deployment URL
          </label>
          <input
            type="url"
            value={formData.deploymentUrl}
            onChange={(e) => setFormData({ ...formData, deploymentUrl: e.target.value })}
            placeholder="Enter live deployment URL"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isGenerating || !formData.jobTitle || !formData.jobDescription || formData.requiredSkills.length === 0}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {isGenerating ? 'Generating Questions...' : 'Generate Interview Questions'}
      </button>
    </form>
  );
}
