import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import type { AnalysisEntry } from '../lib/analysisEngine';
import {
    CheckCircle2,
    Calendar,
    BookOpen,
    MessageSquare,
    ChevronLeft,
    Download,
    Copy,
    ExternalLink,
    Info,
    Building2,
    Users,
    Zap,
    Briefcase
} from 'lucide-react';

const CATEGORY_LABELS: Record<string, string> = {
    coreCS: "Core CS Fundamentals",
    languages: "Programming Languages",
    web: "Web Development",
    data: "Data & Databases",
    cloud: "Cloud & DevOps",
    testing: "Software Testing",
    other: "General Skills"
};

export default function Results() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [entry, setEntry] = useState<AnalysisEntry | null>(null);
    const [score, setScore] = useState(0);
    const [confidence, setConfidence] = useState<Record<string, 'know' | 'practice'>>({});

    useEffect(() => {
        const id = searchParams.get('id');
        const history = JSON.parse(localStorage.getItem('placement_history') || '[]');

        let found = null;
        if (id) {
            found = history.find((h: AnalysisEntry) => h.id === id);
        } else if (history.length > 0) {
            found = history.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        }

        if (found) {
            setEntry(found);
            setScore(found.finalScore ?? found.baseScore ?? 0);
            setConfidence(found.skillConfidenceMap || {});
        }
    }, [searchParams]);

    const updatePersistence = useCallback((newScore: number, newMap: Record<string, 'know' | 'practice'>) => {
        if (!entry) return;
        const history = JSON.parse(localStorage.getItem('placement_history') || '[]');
        const updatedHistory = history.map((h: AnalysisEntry) => {
            if (h.id === entry.id) {
                return {
                    ...h,
                    finalScore: newScore,
                    skillConfidenceMap: newMap,
                    updatedAt: new Date().toISOString()
                };
            }
            return h;
        });
        localStorage.setItem('placement_history', JSON.stringify(updatedHistory));
    }, [entry]);

    const toggleSkill = (skill: string) => {
        const current = confidence[skill] || 'practice';
        const next: 'know' | 'practice' = current === 'know' ? 'practice' : 'know';
        const newMap: Record<string, 'know' | 'practice'> = { ...confidence, [skill]: next };

        setConfidence(newMap);

        // Live Score Update: +2 for know, -2 for practice
        let newScore = score + (next === 'know' ? 2 : -2);
        newScore = Math.max(0, Math.min(100, newScore));
        setScore(newScore);

        updatePersistence(newScore, newMap);
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        alert(`${label} copied to clipboard!`);
    };

    const downloadTxt = () => {
        if (!entry) return;

        let content = `PLACEMENT PREP PLAN: ${entry.role} @ ${entry.company}\n`;
        content += `Generated: ${new Date(entry.createdAt).toLocaleString()}\n`;
        content += `Last Updated: ${new Date(entry.updatedAt).toLocaleString()}\n`;
        content += `Current Readiness: ${score}%\n\n`;

        content += `--- 7-DAY PLAN ---\n${entry.plan7Days.map(d => `Day ${d.day} (${d.focus}):\n${d.tasks.map(t => `- ${t}`).join('\n')}`).join('\n\n')}\n\n`;
        content += `--- ROUND CHECKLIST ---\n${entry.checklist.map(r => `${r.roundTitle}:\n${r.items.map(i => `- ${i}`).join('\n')}`).join('\n\n')}\n\n`;
        content += `--- INTERVIEW QUESTIONS ---\n${entry.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n`;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PrepPlan_${entry.company.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!entry) {
        return (
            <div className="py-64 text-center font-sans">
                <p className="text-black/40">No results found.</p>
                <button onClick={() => navigate('/dashboard')} className="btn btn-primary mt-16">Go to Dashboard</button>
            </div>
        );
    }

    const weakSkills = Object.entries(confidence)
        .filter(([_, status]) => status === 'practice')
        .map(([skill]) => skill)
        .slice(0, 3);

    return (
        <div className="space-y-40 pb-64">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/dashboard/history')}
                    className="flex items-center gap-8 text-black/40 hover:text-black/60 transition-colors text-sm font-sans"
                >
                    <ChevronLeft className="w-16 h-16" />
                    Back to History
                </button>
                <div className="flex gap-12">
                    <button onClick={downloadTxt} className="btn btn-secondary text-xs flex items-center gap-8">
                        <Download className="w-14 h-14" /> Download TXT
                    </button>
                </div>
            </div>

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-24 border-b border-black/5 pb-32">
                <div>
                    <h2 className="text-40 font-serif leading-tight">{entry.role || "Software Engineer"} Analysis</h2>
                    <p className="text-black/40 font-sans mt-8">
                        <span className="text-black/60 font-medium">{entry.company || "Unknown Company"}</span> • {new Date(entry.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex items-center gap-16 bg-primary/5 p-16 px-24 rounded-2xl border border-primary/10">
                    <div className="text-right">
                        <div className="text-[10px] uppercase tracking-widest text-primary/60 font-bold">Readiness Score</div>
                        <div className="text-32 font-serif text-primary leading-none">{score}%</div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-32">
                <div className="lg:col-span-2 space-y-32">
                    {/* Company Intel Block */}
                    {entry.companyIntel && (
                        <Card className="border-primary/10 bg-primary/[0.01]">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-12 text-primary">
                                    <Building2 className="w-20 h-20" />
                                    Company Intel
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-24">
                                <div className="space-y-16">
                                    <div>
                                        <h4 className="text-[10px] uppercase tracking-widest font-bold text-black/30 mb-4">Industry & Size</h4>
                                        <div className="flex flex-wrap gap-12">
                                            <span className="flex items-center gap-6 text-sm font-sans text-black/60">
                                                <Zap className="w-14 h-14" /> {entry.companyIntel.industry}
                                            </span>
                                            <span className="flex items-center gap-6 text-sm font-sans text-black/60">
                                                <Users className="w-14 h-14" /> {entry.companyIntel.sizeCategory}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] uppercase tracking-widest font-bold text-black/30 mb-4">Typical Hiring Focus</h4>
                                        <p className="text-sm font-sans text-black/70 leading-relaxed">{entry.companyIntel.hiringFocus}</p>
                                    </div>
                                </div>
                                <div className="p-16 bg-white/50 rounded-xl border border-black/5 italic text-xs text-black/40 h-fit">
                                    <Info className="w-14 h-14 mb-8" />
                                    Demo Mode: Company intel generated heuristically.
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Extracted Skills (Interactive) */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-12">
                                <BookOpen className="w-20 h-20 text-primary" />
                                Skill Self-Assessment
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-24">
                            {Object.entries(entry.extractedSkills).map(([catKey, skills]) => {
                                if (!skills || skills.length === 0) return null;
                                return (
                                    <div key={catKey}>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-black/30 mb-12">{CATEGORY_LABELS[catKey] || catKey}</h4>
                                        <div className="flex flex-wrap gap-8">
                                            {skills.map(skill => {
                                                const isKnown = confidence[skill] === 'know';
                                                return (
                                                    <button
                                                        key={skill}
                                                        onClick={() => toggleSkill(skill)}
                                                        className={`px-12 py-6 border transition-all rounded-full text-xs font-medium flex items-center gap-8 ${isKnown
                                                            ? 'bg-green-50 border-green-200 text-green-700'
                                                            : 'bg-black/[0.03] border-black/5 text-black/60 hover:border-primary/30'
                                                            }`}
                                                    >
                                                        {skill}
                                                        {isKnown ? <CheckCircle2 className="w-14 h-14" /> : <div className="w-14 h-14 rounded-full border border-current opacity-30" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    {/* 7-Day Plan */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-12">
                            <CardTitle className="flex items-center gap-12">
                                <Calendar className="w-20 h-20 text-primary" />
                                7-Day Intensive Plan
                            </CardTitle>
                            <button onClick={() => copyToClipboard(entry.plan7Days.map(d => `Day ${d.day}: ${d.focus}`).join('\n'), 'Plan')} className="text-black/30 hover:text-primary transition-colors">
                                <Copy className="w-16 h-16" />
                            </button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-0 border-l border-black/5 ml-8 pl-24">
                                {entry.plan7Days.map((step, idx) => (
                                    <div key={idx} className="relative pb-24 last:pb-0">
                                        <div className="absolute -left-[33px] top-4 w-16 h-16 rounded-full bg-white border-2 border-primary" />
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-bold font-serif">Day {step.day}: {step.focus}</h4>
                                            <ul className="list-disc list-inside text-xs text-black/60 font-sans space-y-4">
                                                {step.tasks.map((task, tIdx) => <li key={tIdx}>{task}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Interview Questions */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-12">
                            <CardTitle className="flex items-center gap-12">
                                <MessageSquare className="w-20 h-20 text-primary" />
                                Likely Interview Questions
                            </CardTitle>
                            <button onClick={() => copyToClipboard(entry.questions.join('\n'), 'Questions')} className="text-black/30 hover:text-primary transition-colors">
                                <Copy className="w-16 h-16" />
                            </button>
                        </CardHeader>
                        <CardContent className="space-y-16">
                            {entry.questions.map((q, idx) => (
                                <div key={idx} className="p-16 bg-black/[0.01] border border-black/5 rounded-xl font-sans text-sm text-black/70 italic">
                                    "{q}"
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-32">
                    {/* Round Mapping (Dynamic Timeline) */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-12 text-primary">
                                <Briefcase className="w-20 h-20" />
                                Recruitment Flow
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-32 relative before:absolute before:left-7 before:top-2 before:bottom-2 before:w-2 before:bg-black/5">
                                {(entry.roundMapping || []).map((round, idx) => (
                                    <div key={idx} className="relative pl-32">
                                        <div className="absolute left-0 top-6 w-16 h-16 rounded-full bg-primary border-4 border-white shadow-sm" />
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-bold font-serif">{round.roundTitle}</h4>
                                            <div className="flex flex-wrap gap-4">
                                                {round.focusAreas.map(f => (
                                                    <span key={f} className="text-[10px] bg-black/5 px-6 py-2 rounded text-black/50">{f}</span>
                                                ))}
                                            </div>
                                            <div className="mt-8 flex items-start gap-8 p-8 bg-black/[0.02] border border-black/5 rounded-lg">
                                                <Info className="w-12 h-12 text-primary/40 mt-2 flex-shrink-0" />
                                                <p className="text-[10px] text-black/40 font-sans italic">{round.whyItMatters}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Next Box */}
                    <Card className="bg-primary text-white shadow-xl shadow-primary/20 overflow-hidden">
                        <div className="p-24 space-y-24 relative">
                            <div className="absolute top-0 right-0 p-32 opacity-10 pointer-events-none">
                                <Zap className="w-128 h-128" />
                            </div>
                            <div className="space-y-8">
                                <h3 className="text-24 font-serif italic">Next Step</h3>
                                <p className="text-white/70 text-sm font-sans">Focus on your key areas for improvement.</p>
                            </div>

                            {weakSkills.length > 0 && (
                                <div className="space-y-12">
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-white/40">Critical Weak Skills</p>
                                    <div className="flex flex-wrap gap-8">
                                        {weakSkills.map(s => (
                                            <span key={s} className="px-10 py-4 bg-white/10 rounded-full text-xs font-medium border border-white/10">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button onClick={() => navigate('/dashboard/practice')} className="w-full py-12 bg-white text-primary rounded-xl font-bold flex items-center justify-center gap-8 hover:bg-white/90 transition-all">
                                <ExternalLink className="w-16 h-16" />
                                Start Day 1 plan now
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
