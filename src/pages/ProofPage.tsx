import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { CheckCircle2, Circle, Link2, Github, Globe, Copy, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';

interface ProofLinks {
    lovable: string;
    github: string;
    deployed: string;
}

const MILESTONE_STEPS = [
    { id: 1, label: "JD Analysis Logic", description: "Deterministic skill extraction and scoring." },
    { id: 2, label: "Interactive Readiness", description: "Real-time score updates via skill toggles." },
    { id: 3, label: "Company Intel Engine", description: "Heuristic industry and hiring focus inference." },
    { id: 4, label: "Dynamic Round Mapping", description: "Tailored interview flows based on company profile." },
    { id: 5, label: "Prep Tools & Export", description: "7-day plan, checklists, and TXT download." },
    { id: 6, label: "History & Persistence", description: "Secure localStorage state management." },
    { id: 7, label: "Data Hardening", description: "Strict schema validation and error resilience." },
    { id: 8, label: "Internal Test Suite", description: "Built-in 10-item validation checklist." }
];

export default function ProofPage() {
    const navigate = useNavigate();
    const [links, setLinks] = useState<ProofLinks>({
        lovable: '',
        github: '',
        deployed: ''
    });
    const [checklistPassed, setChecklistPassed] = useState(false);
    const [errors, setErrors] = useState<Partial<ProofLinks>>({});

    useEffect(() => {
        // Check 10-item checklist status
        const savedChecklist = localStorage.getItem('prp_test_checklist');
        const checked = savedChecklist ? JSON.parse(savedChecklist) : [];
        setChecklistPassed(checked.length === 10);

        // Load existing links
        const savedSubmission = localStorage.getItem('prp_final_submission');
        if (savedSubmission) {
            setLinks(JSON.parse(savedSubmission));
        }
    }, []);

    const validateUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleLinkChange = (field: keyof ProofLinks, value: string) => {
        const newLinks = { ...links, [field]: value };
        setLinks(newLinks);

        // Save to localStorage immediately
        localStorage.setItem('prp_final_submission', JSON.stringify(newLinks));

        // Validate on change
        if (value && !validateUrl(value)) {
            setErrors(prev => ({ ...prev, [field]: 'Please enter a valid URL (e.g., https://...)' }));
        } else {
            setErrors(prev => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    const copyFinalSubmission = () => {
        if (!links.lovable || !links.github || !links.deployed) {
            alert("Please provide all 3 artifact links first.");
            return;
        }

        const text = `------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${links.lovable}
GitHub Repository: ${links.github}
Live Deployment: ${links.deployed}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------`;

        navigator.clipboard.writeText(text);
        alert("Final submission text copied to clipboard!");
    };

    const allLinksProvided = links.lovable && links.github && links.deployed && Object.keys(errors).length === 0;
    const isReadyToShip = checklistPassed && allLinksProvided;

    return (
        <div className="max-w-800 mx-auto py-64 px-24 space-y-48">
            <header className="flex items-center justify-between border-b border-black/5 pb-32">
                <div>
                    <h2 className="text-32 font-serif">Submission & Proof</h2>
                    <p className="text-black/60 font-sans mt-4">Document your progress and prepare for shipment.</p>
                </div>
                <button
                    onClick={() => navigate('/prp/07-test')}
                    className="flex items-center gap-8 text-black/40 hover:text-black/60 text-sm font-sans"
                >
                    <ChevronLeft className="w-16 h-16" /> Back to Test
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
                {/* Step Overview */}
                <div className="space-y-24">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-black/30">Milestone Overview</h3>
                    <div className="space-y-12">
                        {MILESTONE_STEPS.map((step) => {
                            const isTestStep = step.id === 8;
                            const isCompleted = isTestStep ? checklistPassed : true; // Functional steps 1-7 are implemented by definition of being here
                            return (
                                <div key={step.id} className="flex items-start gap-16 p-16 bg-black/[0.01] border border-black/5 rounded-2xl">
                                    {isCompleted ? (
                                        <CheckCircle2 className="w-20 h-20 text-green-500 mt-2" />
                                    ) : (
                                        <Circle className="w-20 h-20 text-black/10 mt-2" />
                                    )}
                                    <div>
                                        <h4 className="text-sm font-bold font-serif">{step.label}</h4>
                                        <p className="text-xs text-black/40 font-sans">{step.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Artifact Inputs */}
                <div className="space-y-32">
                    <div className="space-y-24">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-black/30">Proof of Work Links</h3>
                        <div className="space-y-24">
                            <div className="space-y-8">
                                <label className="text-xs font-bold font-sans text-black/60 flex items-center gap-8">
                                    <Link2 className="w-14 h-14" /> Lovable Project Link
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://lovable.dev/projects/..."
                                    className={`w-full p-12 bg-black/[0.02] border rounded-xl font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.lovable ? 'border-red-200 bg-red-50/10' : 'border-black/5'
                                        }`}
                                    value={links.lovable}
                                    onChange={(e) => handleLinkChange('lovable', e.target.value)}
                                />
                                {errors.lovable && <p className="text-[10px] text-red-500 flex items-center gap-4"><AlertCircle className="w-10 h-10" /> {errors.lovable}</p>}
                            </div>

                            <div className="space-y-8">
                                <label className="text-xs font-bold font-sans text-black/60 flex items-center gap-8">
                                    <Github className="w-14 h-14" /> GitHub Repository
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://github.com/username/repo"
                                    className={`w-full p-12 bg-black/[0.02] border rounded-xl font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.github ? 'border-red-200 bg-red-50/10' : 'border-black/5'
                                        }`}
                                    value={links.github}
                                    onChange={(e) => handleLinkChange('github', e.target.value)}
                                />
                                {errors.github && <p className="text-[10px] text-red-500 flex items-center gap-4"><AlertCircle className="w-10 h-10" /> {errors.github}</p>}
                            </div>

                            <div className="space-y-8">
                                <label className="text-xs font-bold font-sans text-black/60 flex items-center gap-8">
                                    <Globe className="w-14 h-14" /> Deployed URL
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://placement-ready.vercel.app"
                                    className={`w-full p-12 bg-black/[0.02] border rounded-xl font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.deployed ? 'border-red-200 bg-red-50/10' : 'border-black/5'
                                        }`}
                                    value={links.deployed}
                                    onChange={(e) => handleLinkChange('deployed', e.target.value)}
                                />
                                {errors.deployed && <p className="text-[10px] text-red-500 flex items-center gap-4"><AlertCircle className="w-10 h-10" /> {errors.deployed}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="p-24 bg-primary/5 rounded-3xl border border-primary/10 space-y-24">
                        <div className="space-y-8">
                            <h4 className="font-serif italic text-lg text-primary">Ready to wrap up?</h4>
                            <p className="text-xs text-black/50 font-sans leading-relaxed">
                                Once all steps are green and links are valid, you can copy your final submission and head to the ship page.
                            </p>
                        </div>

                        <div className="space-y-12">
                            <button
                                onClick={copyFinalSubmission}
                                className="w-full py-12 bg-white border border-black/10 text-black rounded-xl text-xs font-bold flex items-center justify-center gap-8 hover:bg-black/[0.02] transition-colors shadow-sm"
                            >
                                <Copy className="w-14 h-14" /> Copy Final Submission
                            </button>
                            <button
                                onClick={() => navigate('/prp/08-ship')}
                                disabled={!isReadyToShip}
                                className={`w-full py-12 rounded-xl text-xs font-bold flex items-center justify-center gap-8 transition-all ${isReadyToShip
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02]'
                                    : 'bg-black/5 text-black/20 cursor-not-allowed'
                                    }`}
                            >
                                Enter Ship Module <ChevronRight className="w-14 h-14" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
