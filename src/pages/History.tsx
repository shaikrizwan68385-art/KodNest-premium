import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Calendar, ChevronRight, FileText } from 'lucide-react';
import type { AnalysisEntry } from '../lib/analysisEngine';
import { useEffect, useState } from 'react';

export default function History() {
    const [history, setHistory] = useState<AnalysisEntry[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const saved = localStorage.getItem('placement_history');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    // Filter corrupted entries: must have id, createdAt, and extractedSkills
                    const valid = parsed.filter(entry =>
                        entry &&
                        typeof entry === 'object' &&
                        entry.id &&
                        entry.createdAt &&
                        entry.extractedSkills
                    );
                    setHistory(valid);
                    if (valid.length < parsed.length) {
                        alert("One or more saved entries couldn't be loaded and were skipped.");
                    }
                }
            } catch (e) {
                console.error("History parse error", e);
                setHistory([]);
            }
        }
    }, []);

    const viewResults = (id: string) => {
        navigate(`/dashboard/results?id=${id}`);
    };

    return (
        <div className="space-y-32">
            <header>
                <h2 className="text-32 font-serif">Analysis History</h2>
                <p className="text-black/60 font-sans">Review your previous job description analyses.</p>
            </header>

            <div className="space-y-16">
                {history.length > 0 ? (
                    history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((entry) => (
                        <Card key={entry.id} className="cursor-pointer hover:bg-black/[0.01] transition-colors" onClick={() => viewResults(entry.id)}>
                            <CardContent className="p-24 flex items-center justify-between">
                                <div className="flex items-center gap-24">
                                    <div className="p-12 bg-primary/5 text-primary rounded-xl">
                                        <FileText className="w-24 h-24" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-serif">{entry.role || 'Software Engineer'}</h3>
                                        <div className="flex items-center gap-12 text-sm text-black/40 font-sans mt-4">
                                            <span className="font-medium text-black/60">{entry.company || 'Unknown Company'}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-4">
                                                <Calendar className="w-14 h-14" />
                                                {new Date(entry.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-24">
                                    <div className="text-right">
                                        <div className="text-24 font-serif text-primary">
                                            {entry.finalScore ?? entry.baseScore ?? 0}%
                                        </div>
                                        <div className="text-[10px] uppercase tracking-wider text-black/40 font-sans">Score</div>
                                    </div>
                                    <ChevronRight className="w-20 h-20 text-black/20" />
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="py-64 text-center border-2 border-dashed border-black/5 rounded-2xl">
                        <p className="text-black/40 font-sans">No analysis history found.</p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="btn btn-primary mt-16"
                        >
                            Start New Analysis
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
