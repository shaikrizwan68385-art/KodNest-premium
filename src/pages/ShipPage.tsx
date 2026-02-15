import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Rocket, CheckCircle2, ChevronLeft, Sparkles, Globe, ChevronRight, Github } from 'lucide-react';

export default function ShipPage() {
    const navigate = useNavigate();

    const savedChecklist = localStorage.getItem('prp_test_checklist');
    const checked = savedChecklist ? JSON.parse(savedChecklist) : [];
    const checklistPassed = checked.length === 10;

    const savedSubmission = localStorage.getItem('prp_final_submission');
    const links = savedSubmission ? JSON.parse(savedSubmission) : {};
    const linksProvided = links.lovable && links.github && links.deployed;

    // Steps 1-7 are implemented by being in the app, Step 8 is the checklist
    const allStepsCompleted = checklistPassed; // For now mapping all 8 milestones to the final verification

    const isShipped = checklistPassed && linksProvided && allStepsCompleted;

    useEffect(() => {
        if (!checklistPassed) {
            navigate('/prp/07-test');
        }
    }, [checklistPassed, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center p-24 bg-primary/5">
            <div className="max-w-600 w-full space-y-40">
                <header className="text-center space-y-16">
                    <div className="inline-flex justify-center items-center gap-16 mb-16">
                        <div className={`p-8 px-16 rounded-full text-[10px] font-bold uppercase tracking-widest ${isShipped ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                            Status: {isShipped ? 'Shipped' : 'In Progress'}
                        </div>
                    </div>
                    <div className="inline-flex p-16 bg-primary/10 rounded-3xl text-primary">
                        <Rocket className="w-48 h-48 animate-bounce" />
                    </div>
                    <h1 className="text-48 font-serif leading-tight">
                        {isShipped ? "Project Shipped" : "Finalizing Shipment"}
                    </h1>
                    <p className="text-black/60 font-sans max-w-400 mx-auto">
                        {isShipped
                            ? "You built a real product. Not a tutorial. Not a clone. A structured tool that solves a real problem."
                            : "All 10 systems are verified. Provide proof of work to finalize your shipment."}
                    </p>
                </header>

                <Card className={`border-primary/20 bg-white/50 backdrop-blur-sm shadow-2xl shadow-primary/10 transition-all ${isShipped ? 'ring-2 ring-green-500/20' : ''
                    }`}>
                    <CardContent className="p-40 space-y-32">
                        {isShipped ? (
                            <div className="space-y-24 text-center">
                                <div className="p-24 bg-green-50 border border-green-100 rounded-3xl space-y-8">
                                    <Sparkles className="w-32 h-32 text-green-600 mx-auto" />
                                    <h4 className="font-serif italic text-xl text-green-900">This is your proof of work.</h4>
                                </div>
                                <p className="text-sm text-black/40 font-sans leading-relaxed">
                                    Your Placement Readiness Platform is fully verified, documented, and ready for the world.
                                </p>
                            </div>
                        ) : (
                            <div className="flex items-center gap-16 p-24 bg-amber-50 border border-amber-100 rounded-2xl">
                                <CheckCircle2 className="w-32 h-32 text-amber-600" />
                                <div>
                                    <h3 className="font-bold text-amber-900">Awaiting Proof</h3>
                                    <p className="text-sm text-amber-700/80">Checklist: 10/10. Links: Pending.</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-16">
                            {isShipped ? (
                                <button className="w-full py-16 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-12 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                                    <Globe className="w-20 h-20" />
                                    View Live Deployment
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate('/prp/proof')}
                                    className="w-full py-16 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-12 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                >
                                    Complete Proof Profile <ChevronRight className="w-20 h-20" />
                                </button>
                            )}
                            <button className="w-full py-16 bg-white border border-black/10 rounded-2xl font-bold flex items-center justify-center gap-12 hover:bg-black/[0.02] transition-all text-xs text-black/60">
                                <Github className="w-16 h-16" />
                                Back to Repository
                            </button>
                        </div>

                        <div className="pt-24 border-t border-black/5 flex justify-center">
                            <button
                                onClick={() => navigate('/prp/07-test')}
                                className="flex items-center gap-8 text-black/40 hover:text-black/60 text-sm font-sans"
                            >
                                <ChevronLeft className="w-16 h-16" /> Back to Checklist
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
