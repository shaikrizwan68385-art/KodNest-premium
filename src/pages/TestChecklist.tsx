import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { CheckCircle2, AlertTriangle, RotateCcw, ChevronRight, Info } from 'lucide-react';

interface TestItem {
    id: number;
    label: string;
    hint: string;
}

const TEST_ITEMS: TestItem[] = [
    { id: 1, label: "JD required validation works", hint: "Try to analyze with an empty JD field." },
    { id: 2, label: "Short JD warning shows for <200 chars", hint: "Paste a few words and check for the warning alert." },
    { id: 3, label: "Skills extraction groups correctly", hint: "Verify skills are categorized (Core CS, Languages, etc.) on results page." },
    { id: 4, label: "Round mapping changes based on company + skills", hint: "Compare 'Amazon' vs a 'Startup' to see different round flows." },
    { id: 5, label: "Score calculation is deterministic", hint: "Multiple analyses with same JD should yield same base score." },
    { id: 6, label: "Skill toggles update score live", hint: "Toggle 'I know this' and verify the score changes by +/- 2." },
    { id: 7, label: "Changes persist after refresh", hint: "Toggle a skill, refresh, and verify the state is saved." },
    { id: 8, label: "History saves and loads correctly", hint: "Go to History page and verify your recent analysis is there." },
    { id: 9, label: "Export buttons copy the correct content", hint: "Click 'Copy Plan' and paste it into a notepad to verify." },
    { id: 10, label: "No console errors on core pages", hint: "Open DevTools (F12) and check for red error logs." },
];

export default function TestChecklist() {
    const navigate = useNavigate();
    const [checked, setChecked] = useState<number[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('prp_test_checklist');
        if (saved) {
            setChecked(JSON.parse(saved));
        }
    }, []);

    const toggleItem = (id: number) => {
        const newChecked = checked.includes(id)
            ? checked.filter(i => i !== id)
            : [...checked, id];

        setChecked(newChecked);
        localStorage.setItem('prp_test_checklist', JSON.stringify(newChecked));
    };

    const resetChecklist = () => {
        if (confirm("Are you sure you want to reset all test progress?")) {
            setChecked([]);
            localStorage.removeItem('prp_test_checklist');
        }
    };

    const passedCount = checked.length;
    const isComplete = passedCount === 10;

    return (
        <div className="max-w-800 mx-auto py-64 px-24 space-y-40">
            <header className="space-y-16">
                <div className="flex items-center justify-between">
                    <h2 className="text-32 font-serif">Internal Test Checklist</h2>
                    <button
                        onClick={resetChecklist}
                        className="flex items-center gap-8 text-black/40 hover:text-primary transition-colors text-sm font-sans"
                    >
                        <RotateCcw className="w-16 h-16" /> Reset
                    </button>
                </div>

                <div className={`p-24 rounded-2xl border flex items-center justify-between transition-all ${isComplete ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
                    }`}>
                    <div>
                        <p className={`text-24 font-serif ${isComplete ? 'text-green-700' : 'text-amber-700'}`}>
                            Tests Passed: {passedCount} / 10
                        </p>
                        {!isComplete && (
                            <p className="text-sm font-sans text-amber-600 mt-4 flex items-center gap-8">
                                <AlertTriangle className="w-14 h-14" /> Fix issues before shipping.
                            </p>
                        )}
                    </div>
                    {isComplete ? (
                        <button
                            onClick={() => navigate('/prp/08-ship')}
                            className="btn btn-primary flex items-center gap-8"
                        >
                            Proceed to Ship <ChevronRight className="w-16 h-16" />
                        </button>
                    ) : (
                        <div className="text-black/20">
                            <CheckCircle2 className="w-40 h-40" />
                        </div>
                    )}
                </div>
            </header>

            <div className="grid gap-16">
                {TEST_ITEMS.map((item) => (
                    <Card
                        key={item.id}
                        className={`cursor-pointer transition-all border-l-4 ${checked.includes(item.id) ? 'border-l-green-500 bg-green-50/10' : 'border-l-transparent'
                            }`}
                        onClick={() => toggleItem(item.id)}
                    >
                        <CardContent className="p-20 flex items-start gap-16">
                            <div className={`mt-4 w-20 h-20 rounded border flex items-center justify-center transition-all ${checked.includes(item.id) ? 'bg-green-500 border-green-500 text-white' : 'border-black/20 text-transparent'
                                }`}>
                                <CheckCircle2 className="w-14 h-14" />
                            </div>
                            <div className="space-y-4">
                                <h3 className={`font-sans font-medium ${checked.includes(item.id) ? 'text-black/60 line-through' : 'text-black'}`}>
                                    {item.label}
                                </h3>
                                <div className="flex items-start gap-8 py-4 px-8 bg-black/[0.02] rounded text-[11px] text-black/40 italic">
                                    <Info className="w-12 h-12 flex-shrink-0 mt-2" />
                                    <span>How to test: {item.hint}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <footer className="text-center pt-32">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-black/40 hover:text-black/60 text-sm font-sans"
                >
                    Back to Dashboard
                </button>
            </footer>
        </div>
    );
}
