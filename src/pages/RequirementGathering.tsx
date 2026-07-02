import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SERVICES } from '@/constants';

export default function RequirementGathering() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const serviceId = searchParams.get('service') || '';
  const preselected = SERVICES.find((s) => s.id === serviceId);

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: preselected?.title || '',
    description: '',
    features: '',
    budget: '',
    timeline: '',
    documents: null as File | null});

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ background: '#050505', minHeight: '100vh', paddingTop: '80px' }} className="flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-[#00D26A]/20 flex items-center justify-center text-4xl mx-auto mb-6">
            ✅
          </div>
          <h2 className="text-white text-2xl font-bold mb-4" >
            Requirements Submitted!
          </h2>
          <p className="text-[#AFAFAF] mb-8">
            We've received your project requirements for <strong className="text-white">{form.service}</strong>. Our team will analyze your needs and reach out within 24 hours.
          </p>
          <div className="glass rounded-xl p-5 text-sm text-left space-y-2 mb-8">
            {[
              ['Service', form.service],
              ['Contact', form.name],
              ['Email', form.email],
              ['Budget', form.budget],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-[#AFAFAF]">{k}</span>
                <span className="text-white font-medium">{v || '—'}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/')} className="btn-outline px-6 py-2.5">
              Back to Home
            </button>
            <button onClick={() => navigate('/client-connect')} className="btn-primary px-6 py-2.5">
              Full Consultation →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#050505', minHeight: '100vh', paddingTop: '80px' }}>
      {/* Header */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative max-w-4xl mx-auto px-6">
          {preselected && (
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">{preselected.icon}</span>
              <div>
                <span className="section-tag" style={{ marginBottom: 0 }}>
                  {preselected.title}
                </span>
              </div>
            </div>
          )}
          <h1 className="text-4xl lg:text-6xl font-black text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
            Tell Us About <span className="gradient-text">Your Project</span>
          </h1>
          <p className="text-[#AFAFAF] text-lg max-w-xl">
            Fill in your requirements and we'll analyze your needs to prepare a detailed proposal.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <form onSubmit={handleSubmit}>
            <div
              className="rounded-2xl p-8 space-y-6"
              style={{ background: '#111111', border: '1px solid rgba(47,47,228,0.15)' }}
            >
              {/* Client Info */}
              <div>
                <h3 className="text-white font-bold mb-4" >
                  👤 Client Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#AFAFAF] text-sm block mb-2">Full Name *</label>
                    <input className="form-input" placeholder="John Smith" value={form.name} onChange={(e) => update('name', e.target.value)} required />
                  </div>
                  <div>
                    <label className="text-[#AFAFAF] text-sm block mb-2">Company</label>
                    <input className="form-input" placeholder="Company Name" value={form.company} onChange={(e) => update('company', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-[#AFAFAF] text-sm block mb-2">Email *</label>
                    <input className="form-input" type="email" placeholder="john@company.com" value={form.email} onChange={(e) => update('email', e.target.value)} required />
                  </div>
                  <div>
                    <label className="text-[#AFAFAF] text-sm block mb-2">Phone</label>
                    <input className="form-input" placeholder="+1 (555) 000-0000" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Service */}
              <div>
                <h3 className="text-white font-bold mb-4" >
                  ⚙️ Selected Service
                </h3>
                <select
                  className="form-input"
                  value={form.service}
                  onChange={(e) => update('service', e.target.value)}
                  required
                  style={{ background: 'rgba(255,255,255,0.05)', color: form.service ? 'white' : '#AFAFAF' }}
                >
                  <option value="">Select a service</option>
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.title} style={{ background: '#111' }}>
                      {s.icon} {s.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Details */}
              <div>
                <h3 className="text-white font-bold mb-4" >
                  📋 Project Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[#AFAFAF] text-sm block mb-2">Business Description *</label>
                    <textarea
                      className="form-input"
                      rows={4}
                      placeholder="Describe your business and what problem this project will solve..."
                      value={form.description}
                      onChange={(e) => update('description', e.target.value)}
                      required
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                  <div>
                    <label className="text-[#AFAFAF] text-sm block mb-2">Required Features</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      placeholder="List specific features, integrations, or technical requirements..."
                      value={form.features}
                      onChange={(e) => update('features', e.target.value)}
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                </div>
              </div>

              {/* Budget & Timeline */}
              <div>
                <h3 className="text-white font-bold mb-4" >
                  💰 Budget & Timeline
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#AFAFAF] text-sm block mb-2">Budget Range</label>
                    <select
                      className="form-input"
                      value={form.budget}
                      onChange={(e) => update('budget', e.target.value)}
                      style={{ background: 'rgba(255,255,255,0.05)', color: form.budget ? 'white' : '#AFAFAF' }}
                    >
                      <option value="">Select budget</option>
                      {['Under $5K', '$5K–$15K', '$15K–$50K', '$50K–$150K', '$150K+', 'Not sure'].map((b) => (
                        <option key={b} value={b} style={{ background: '#111' }}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[#AFAFAF] text-sm block mb-2">Timeline</label>
                    <select
                      className="form-input"
                      value={form.timeline}
                      onChange={(e) => update('timeline', e.target.value)}
                      style={{ background: 'rgba(255,255,255,0.05)', color: form.timeline ? 'white' : '#AFAFAF' }}
                    >
                      <option value="">Select timeline</option>
                      {['ASAP', '1–3 months', '3–6 months', '6–12 months', 'Flexible'].map((t) => (
                        <option key={t} value={t} style={{ background: '#111' }}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <h3 className="text-white font-bold mb-4" >
                  📎 Upload Documents (Optional)
                </h3>
                <div
                  className="border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer hover:border-[#2F2FE4]/50"
                  style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <div className="text-3xl mb-2">📄</div>
                  <p className="text-[#AFAFAF] text-sm">
                    {form.documents ? (form.documents as File).name : 'Drop files here or click to upload'}
                  </p>
                  <p className="text-[#AFAFAF] text-xs mt-1">PDF, DOC, XLS, PNG up to 10MB</p>
                  <input
                    id="file-input"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg"
                    onChange={(e) => setForm((f) => ({ ...f, documents: e.target.files?.[0] || null }))}
                  />
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="btn-primary w-full py-4 text-base animate-pulseGlow">
                🚀 Submit Requirements
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
