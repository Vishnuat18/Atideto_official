import React, { useState, useRef, useEffect } from 'react';
import { UseFormRegister, FieldErrors, Control, useController } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { X, Upload, FileText, Trash2, Palette, Bot, FileText as FileDesc, Code2, AlertCircle } from 'lucide-react';

interface ProjectInfoProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  control: Control<any>;
  selectedServices: string[];
  showDescriptionOnly?: boolean;
  showAssetsOnly?: boolean;
}

const TECH_SUGGESTIONS = [
  'React', 'Next.js', 'Angular', 'Vue', 'Flutter', 'React Native', 'Android', 'iOS',
  'Node.js', 'Express', 'Spring Boot', 'Python', 'FastAPI', 'Django', 'MongoDB',
  'MySQL', 'PostgreSQL', 'Firebase', 'AWS', 'Azure', 'Docker', 'Kubernetes',
  'AI', 'OpenAI', 'LangChain', 'Other'
];

export default function ProjectInformation({ 
  register, 
  errors, 
  control, 
  selectedServices,
  showDescriptionOnly,
  showAssetsOnly
}: ProjectInfoProps) {
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

  const techStackField = (
    <div className="cc-field">
      <label className="cc-label" htmlFor="tech-input">
        Preferred Tech Stack <span className="opt">(Optional)</span>
      </label>

      {/* Selected Stacks */}
      {techField.value.length > 0 && (
        <div className="cc-tags">
          {techField.value.map((tech: string) => (
            <span key={tech} className="cc-tag">
              {tech}
              <button type="button" onClick={() => removeTech(tech)} aria-label={`Remove ${tech}`}>
                <X />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="cc-input-wrap">
        <span className="lead"><Code2 /></span>
        <input
          id="tech-input"
          type="text"
          placeholder=" "
          value={techInput}
          onChange={(e) => {
            setTechInput(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="cc-input"
        />
        <label className="cc-float" htmlFor="tech-input">Search technologies (e.g. Next.js, OpenAI)...</label>

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="cc-suggest">
            {filteredSuggestions.map((tech) => (
              <button
                key={tech}
                type="button"
                onMouseDown={() => addTech(tech)}
              >
                {tech}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const descriptionSection = (
    <div className="cc-field">
      <label className="cc-label" htmlFor="description">
        Project Description
      </label>
      <div className="cc-input-wrap">
        <span className="lead" style={{ top: '1.1rem', transform: 'none' }}><FileDesc /></span>
        <textarea
          id="description"
          ref={textareaRef}
          rows={3}
          placeholder="Describe the scope, goals, and key features of your project..."
          onInput={handleTextareaInput}
          className={`cc-input ${errors.description ? 'error' : ''}`}
          style={{ paddingLeft: '2.7rem' }}
          {...register('description', { required: 'Please enter a project description' })}
        />
      </div>
      {errors.description && (
        <span className="cc-error"><AlertCircle /> {errors.description.message as string}</span>
      )}
    </div>
  );

  const assetsSection = (
    <>
      {/* 1. Dynamic Questions */}
      {selectedServices.some(s => ['Website', 'Mobile App', 'Desktop Software'].includes(s)) && (
        <div className="cc-field">
          <label className="cc-label">
            Do you have wireframes or UI/UX designs ready?
          </label>
          <div className="cc-radio">
            {['Yes, they are ready', 'No, we need design help', 'Only rough sketches'].map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  value={option}
                  {...register('designStatus')}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {selectedServices.some(s => ['AI Automation', 'AI Agents'].includes(s)) ? (
        <div className="cc-grid-2">
          <div className="cc-field">
            <div className="cc-input-wrap">
              <span className="lead"><Bot /></span>
              <input
                id="aiGoal"
                type="text"
                placeholder=" "
                className="cc-input"
                {...register('aiIntegrations')}
              />
              <label className="cc-float" htmlFor="aiGoal">What systems/platforms should the AI integrate with?</label>
            </div>
          </div>
          {techStackField}
        </div>
      ) : (
        techStackField
      )}

      {/* 4. Drag & Drop Attachments */}
      <div className="cc-field">
        <label className="cc-label">
          Attachments
        </label>

        <div
          {...getRootProps()}
          className={`cc-drop ${isDragActive ? 'active' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="ic"><Upload /></div>
          <p>{isDragActive ? 'Drop the files here...' : 'Drag & Drop files, or click to browse'}</p>
          <small>Supported: PDF, DOCX, PPT, ZIP, PNG, JPG, SVG</small>
        </div>

        {/* Uploaded Files List */}
        {filesField.value.length > 0 && (
          <div className="cc-files">
            {filesField.value.map((file: File, index: number) => (
              <div key={`${file.name}-${index}`} className="cc-file">
                <span className="f-ic"><FileText /></span>
                <div className="meta">
                  <p>{file.name}</p>
                  <small>{(file.size / 1024 / 1024).toFixed(2)} MB</small>
                </div>
                <button type="button" onClick={() => removeFile(index)} aria-label={`Remove ${file.name}`}>
                  <Trash2 />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  if (showDescriptionOnly) return descriptionSection;
  if (showAssetsOnly) return assetsSection;

  return (
    <div className="w-full space-y-7">
      {assetsSection}
      {descriptionSection}
    </div>
  );
}
