import React, { useState, useRef, useEffect } from 'react';
import { UseFormRegister, FieldErrors, Control, useController } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { X, Upload, FileText, Trash2 } from 'lucide-react';

interface ProjectInfoProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  control: Control<any>;
  selectedServices: string[];
}

const TECH_SUGGESTIONS = [
  'React', 'Next.js', 'Angular', 'Vue', 'Flutter', 'React Native', 'Android', 'iOS',
  'Node.js', 'Express', 'Spring Boot', 'Python', 'FastAPI', 'Django', 'MongoDB',
  'MySQL', 'PostgreSQL', 'Firebase', 'AWS', 'Azure', 'Docker', 'Kubernetes',
  'AI', 'OpenAI', 'LangChain', 'Other'
];

export default function ProjectInformation({ register, errors, control, selectedServices }: ProjectInfoProps) {
  const [techInput, setTechInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Tech Stack Controller
  const { field: techField } = useController({
    name: 'techStack',
    control,
    defaultValue: [] as string[]
  });

  // Attachments Controller
  const { field: filesField } = useController({
    name: 'attachments',
    control,
    defaultValue: [] as File[]
  });

  // Auto-expand textarea
  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
  };

  // Tech stack auto-complete
  useEffect(() => {
    if (!techInput) {
      setFilteredSuggestions(TECH_SUGGESTIONS.filter(t => !techField.value.includes(t)));
    } else {
      setFilteredSuggestions(
        TECH_SUGGESTIONS.filter(
          t => t.toLowerCase().includes(techInput.toLowerCase()) && !techField.value.includes(t)
        )
      );
    }
  }, [techInput, techField.value]);

  const addTech = (tech: string) => {
    if (tech && !techField.value.includes(tech)) {
      techField.onChange([...techField.value, tech]);
    }
    setTechInput('');
    setShowSuggestions(false);
  };

  const removeTech = (techToRemove: string) => {
    techField.onChange(techField.value.filter((t: string) => t !== techToRemove));
  };

  // Dropzone setup
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      filesField.onChange([...filesField.value, ...acceptedFiles]);
    },
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/zip': ['.zip'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/svg+xml': ['.svg']
    },
    multiple: true
  });

  const removeFile = (indexToRemove: number) => {
    filesField.onChange(filesField.value.filter((_: any, i: number) => i !== indexToRemove));
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-12 py-6">
      {/* 1. Dynamic Questions */}
      {selectedServices.some(s => ['Website', 'Mobile App', 'Desktop Software'].includes(s)) && (
        <div className="flex flex-col space-y-4 animate-fadeIn">
          <label className="text-[22px] font-medium text-[#CFCFCF]">
            Do you have wireframes or UI/UX designs ready?
          </label>
          <div className="flex gap-4">
            {['Yes, they are ready', 'No, we need design help', 'Only rough sketches'].map((option) => (
              <label key={option} className="flex items-center gap-2 text-white/80 cursor-pointer">
                <input
                  type="radio"
                  value={option}
                  className="accent-[#5B5EFF] h-4 w-4"
                  {...register('designStatus')}
                />
                <span className="text-[15px]">{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {selectedServices.some(s => ['AI Automation', 'AI Agents'].includes(s)) && (
        <div className="flex flex-col space-y-4 animate-fadeIn">
          <label className="text-[22px] font-medium text-[#CFCFCF]" htmlFor="aiGoal">
            What systems/platforms should the AI integrate with?
          </label>
          <div className="relative">
            <input
              id="aiGoal"
              type="text"
              placeholder="e.g. HubSpot, Salesforce, PostgreSQL database..."
              className="w-full bg-transparent border-b border-white/15 pb-3 text-[20px] text-white placeholder-[#7D7D7D] focus:outline-none focus:border-[#5B5EFF] transition-all duration-300"
              {...register('aiIntegrations')}
            />
          </div>
        </div>
      )}

      {/* 2. Project Description */}
      <div className="flex flex-col space-y-4">
        <label className="text-[22px] font-medium text-[#CFCFCF]" htmlFor="description">
          Project Description
        </label>
        <div className="relative">
          <textarea
            id="description"
            ref={textareaRef}
            rows={2}
            placeholder="Describe the scope, goals, and key features of your project..."
            onInput={handleTextareaInput}
            className="w-full bg-transparent border-b border-white/15 pb-3 text-[20px] text-white placeholder-[#7D7D7D] focus:outline-none focus:border-[#5B5EFF] transition-all duration-300 focus:placeholder-transparent resize-none overflow-hidden min-h-[60px]"
            {...register('description', { required: 'Please enter a project description' })}
          />
        </div>
        {errors.description && (
          <span className="text-red-500 text-sm mt-1">{errors.description.message as string}</span>
        )}
      </div>

      {/* 3. Tech Stack Multi-Select */}
      <div className="flex flex-col space-y-4">
        <label className="text-[22px] font-medium text-[#CFCFCF]" htmlFor="tech-input">
          Preferred Tech Stack
        </label>
        
        {/* Selected Stacks */}
        {techField.value.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {techField.value.map((tech: string) => (
              <span 
                key={tech} 
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#5B5EFF]/10 border border-[#5B5EFF]/30 text-white rounded-full text-sm font-semibold transition-all hover:bg-[#5B5EFF]/20"
              >
                {tech}
                <button 
                  type="button" 
                  onClick={() => removeTech(tech)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="relative">
          <input
            id="tech-input"
            type="text"
            placeholder="Search technologies (e.g. Next.js, OpenAI)..."
            value={techInput}
            onChange={(e) => {
              setTechInput(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full bg-transparent border-b border-white/15 pb-3 text-[20px] text-white placeholder-[#7D7D7D] focus:outline-none focus:border-[#5B5EFF] transition-all duration-300"
          />

          {/* Suggestions Dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#050505] border border-white/10 rounded-xl max-h-48 overflow-y-auto z-50 shadow-2xl custom-scrollbar">
              {filteredSuggestions.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onMouseDown={() => addTech(tech)}
                  className="w-full px-4 py-2.5 text-left text-[16px] text-white/80 hover:text-white hover:bg-[#5B5EFF]/20 transition-all font-medium"
                >
                  {tech}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Drag & Drop Attachments */}
      <div className="flex flex-col space-y-4">
        <label className="text-[22px] font-medium text-[#CFCFCF]">
          Attachments
        </label>
        
        <div 
          {...getRootProps()} 
          className={`border border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
            isDragActive 
              ? 'border-[#5B5EFF] bg-[#5B5EFF]/5' 
              : 'border-white/15 hover:border-[#5B5EFF]/60 hover:bg-white/[0.01]'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-10 h-10 text-white/40 mb-3" />
          <p className="text-[16px] text-white/80 font-medium text-center">
            {isDragActive ? "Drop the files here..." : "Drag & Drop files, or click to browse"}
          </p>
          <span className="text-[12px] text-white/40 mt-1">
            Supported: PDF, DOCX, PPT, ZIP, PNG, JPG, SVG
          </span>
        </div>

        {/* Uploaded Files List */}
        {filesField.value.length > 0 && (
          <div className="space-y-2 mt-4">
            {filesField.value.map((file: File, index: number) => (
              <div 
                key={`${file.name}-${index}`} 
                className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#5B5EFF]" />
                  <div>
                    <p className="text-sm font-semibold text-white/95 max-w-xs md:max-w-md truncate">{file.name}</p>
                    <span className="text-xs text-white/45">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => removeFile(index)}
                  className="text-white/40 hover:text-red-400 p-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
