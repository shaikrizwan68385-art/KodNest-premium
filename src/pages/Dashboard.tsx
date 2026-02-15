import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Calendar, Clock, Send, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import {
    type AnalysisEntry,
    extractSkills,
    calculateReadinessScore,
    generateChecklist,
    generatePlan,
    generateQuestions,
    inferCompanyIntel,
    generateRoundMapping
} from '../lib/analysisEngine';

const radarDataDefaults = [
    { subject: 'DSA', A: 75, fullMark: 100 },
    { subject: 'System Design', A: 60, fullMark: 100 },
    { subject: 'Communication', A: 80, fullMark: 100 },
    { subject: 'Resume', A: 85, fullMark: 100 },
    { subject: 'Aptitude', A: 70, fullMark: 100 },
];

export default function Dashboard() {
    const navigate = useNavigate();
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [jd, setJd] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [recentScore, setRecentScore] = useState(72);

    useEffect(() => {
        const history = JSON.parse(localStorage.getItem('placement_history') || '[]');
        if (history.length > 0) {
            setRecentScore(history[0].readinessScore);
        }
    }, []);

    const handleAnalyze = () => {
        if (!jd.trim()) return;

        if (jd.length < 200) {
            if (!confirm("This JD is too short to analyze deeply. Paste full JD for better output. Proceed anyway?")) {
                return;
            }
        }

        setIsAnalyzing(true);

        // Simulate analysis delay for premium feel
        setTimeout(() => {
            const extractedSkills = extractSkills(jd);
            const skillsList = Object.values(extractedSkills).flat();
            // Filter out default skills for score calculation if possible, or just use total length
            const score = calculateReadinessScore(company, role, jd, skillsList.length);

            // Initialize confidence map with 'practice' for all skills
            const skillConfidenceMap: Record<string, 'know' | 'practice'> = {};
            skillsList.forEach(skill => {
                skillConfidenceMap[skill] = 'practice';
            });

            const newEntry: AnalysisEntry = {
                id: Math.random().toString(36).substring(7),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                company: company || "",
                role: role || "",
                jdText: jd,
                extractedSkills,
                roundMapping: generateRoundMapping(company, extractedSkills),
                checklist: generateChecklist(extractedSkills),
                plan7Days: generatePlan(extractedSkills),
                questions: generateQuestions(extractedSkills),
                baseScore: score,
                finalScore: score,
                skillConfidenceMap,
                companyIntel: inferCompanyIntel(company)
            };

            const history = JSON.parse(localStorage.getItem('placement_history') || '[]');
            localStorage.setItem('placement_history', JSON.stringify([newEntry, ...history]));

            setIsAnalyzing(false);
            navigate(`/dashboard/results?id=${newEntry.id}`);
        }, 1500);
    };

    return (
        <div className="space-y-40">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-24">
                <div>
                    <h2 className="text-32 font-serif">Welcome back, John</h2>
                    <p className="text-black/60 font-sans">Ready to ace your next placement?</p>
                </div>
                <div className="flex gap-16">
                    <button onClick={() => navigate('/dashboard/history')} className="btn btn-secondary text-xs">View History</button>
                    <button className="btn btn-primary text-xs flex items-center gap-8">
                        <Sparkles className="w-14 h-14" />
                        Upgrade Pro
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-32">
                {/* Analysis Input - 2/3 width */}
                <div className="lg:col-span-2 space-y-32">
                    <Card className="border-primary/10 shadow-lg shadow-primary/[0.02]">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-12 font-serif italic text-primary">
                                <Sparkles className="w-20 h-20" />
                                Smart JD Analyzer
                            </CardTitle>
                            <CardDescription className="text-sm font-sans">
                                Paste the job description below to generate a tailored preparation plan.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-24">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                <div className="space-y-8">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-black/30 px-4">Company Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Google, Amazon..."
                                        className="w-full px-16 py-12 rounded-xl border border-black/5 bg-black/[0.01] focus:bg-white focus:border-primary/20 outline-none transition-all font-sans text-sm"
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-8">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-black/30 px-4">Job Role</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Frontend Engineer..."
                                        className="w-full px-16 py-12 rounded-xl border border-black/5 bg-black/[0.01] focus:bg-white focus:border-primary/20 outline-none transition-all font-sans text-sm"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-8">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-black/30 px-4">Job Description</label>
                                <textarea
                                    placeholder="Paste the full job description here..."
                                    className="w-full h-240 px-16 py-12 rounded-xl border border-black/5 bg-black/[0.01] focus:bg-white focus:border-primary/20 outline-none transition-all font-sans text-sm resize-none"
                                    value={jd}
                                    onChange={(e) => setJd(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || !jd.trim()}
                                className={`btn btn-primary w-full py-16 text-lg flex items-center justify-center gap-12 group ${isAnalyzing ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isAnalyzing ? (
                                    <>
                                        <div className="w-20 h-20 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Generating Analysis...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-20 h-20 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform" />
                                        Start Analysis
                                    </>
                                )}
                            </button>
                        </CardContent>
                    </Card>

                    {/* Upcoming Assessments */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Assessments</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-12">
                            <AssessmentItem
                                title="DSA Mock Test"
                                date="Tomorrow, 10:00 AM"
                                icon={<Calendar className="w-16 h-16" />}
                            />
                            <AssessmentItem
                                title="System Design Review"
                                date="Wed, 2:00 PM"
                                icon={<Clock className="w-16 h-16" />}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Stats & Goals - 1/3 width */}
                <div className="lg:col-span-1 space-y-32">
                    {/* Overall Readiness */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Readiness</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center py-24">
                            <div className="relative w-160 h-160">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-black/5" />
                                    <circle
                                        cx="80"
                                        cy="80"
                                        r="70"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray={440}
                                        strokeDashoffset={440 - (440 * recentScore) / 100}
                                        strokeLinecap="round"
                                        className="text-primary transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-40 font-serif leading-none">{recentScore}</span>
                                    <span className="text-xs text-black/40 font-sans uppercase tracking-wider">/ 100</span>
                                </div>
                            </div>
                            <p className="mt-24 text-sm text-black/60 font-sans">Readiness Score</p>
                        </CardContent>
                    </Card>

                    {/* Skill Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Skill Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="h-240">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarDataDefaults}>
                                    <PolarGrid stroke="#e5e5e5" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#666' }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="Current" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.15} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Weekly Goals */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Weekly Goals</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-20">
                            <div>
                                <div className="flex justify-between text-[10px] uppercase font-bold text-black/30 mb-8">
                                    <span>Problems Solved</span>
                                    <span>12/20</span>
                                </div>
                                <div className="w-full bg-black/5 h-4 rounded-full overflow-hidden">
                                    <div className="bg-primary h-full w-[60%]" />
                                </div>
                            </div>
                            <div className="flex justify-between items-center bg-black/[0.02] p-12 rounded-xl">
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                    <div key={i} className="flex flex-col items-center gap-4">
                                        <div className={`w-8 h-8 rounded-full ${i < 4 ? 'bg-primary' : 'bg-black/10'}`} />
                                        <span className="text-[10px] text-black/30 font-bold">{day}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function AssessmentItem({ title, date, icon }: { title: string, date: string, icon: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between p-16 border border-black/5 rounded-xl hover:bg-black/[0.01] transition-colors">
            <div className="flex items-center gap-16">
                <div className="p-8 bg-black/5 rounded-lg text-black/60">
                    {icon}
                </div>
                <div>
                    <h4 className="font-serif text-lg leading-tight">{title}</h4>
                    <p className="text-sm text-black/40 font-sans">{date}</p>
                </div>
            </div>
            <button className="text-sm font-sans text-primary hover:underline">Start</button>
        </div>
    );
}

