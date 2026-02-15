import { useNavigate } from 'react-router-dom';
import { Code, Video, BarChart3, ChevronRight } from 'lucide-react';

/**
 * Landing Page Component
 * Represents the public-facing entry point of the platform.
 */
export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero Section: Engages the user with a bold message */}
            <section className="flex-1 flex flex-col justify-center px-40 py-64 bg-background">
                <div className="max-w-screen-xl mx-auto">
                    <h1 className="text-64 md:text-8xl mb-24 leading-tight">
                        Ace Your <br />
                        <span className="text-primary italic">Placement.</span>
                    </h1>
                    <p className="mb-40 text-black/60 font-sans">
                        Practice, assess, and prepare for your dream job with a calm,
                        intentional workspace designed for focus.
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="btn btn-primary text-xl group"
                    >
                        Get Started
                        <ChevronRight className="ml-8 w-20 h-20 group-hover:translate-x-4 transition-transform" />
                    </button>
                </div>
            </section>

            {/* Features Grid: Showcases the core offerings of the platform */}
            <section className="px-40 py-64 bg-white border-y border-black/5">
                <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-40">
                    <FeatureCard
                        icon={<Code className="w-24 h-24" />}
                        title="Practice Problems"
                        description="Master data structures and algorithms with curated sets."
                    />
                    <FeatureCard
                        icon={<Video className="w-24 h-24" />}
                        title="Mock Interviews"
                        description="Simulate real-world interviews with industry experts."
                    />
                    <FeatureCard
                        icon={<BarChart3 className="w-24 h-24" />}
                        title="Track Progress"
                        description="Visualize your growth and identify areas for improvement."
                    />
                </div>
            </section>

            {/* Footer: Simple, clean copyright information */}
            <footer className="px-40 py-24 bg-background border-t border-black/5 text-center">
                <p className="text-black/40 text-sm font-sans mx-auto">
                    &copy; {new Date().getFullYear()} KodNest Premium. All rights reserved.
                </p>
            </footer>
        </div>
    );
}

/**
 * Shared Feature Card Component
 */
function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="card hover:border-primary/20 hover:bg-primary/[0.02] transition-colors">
            <div className="text-primary mb-16">{icon}</div>
            <h3 className="text-24 mb-8">{title}</h3>
            <p className="text-sm text-black/60 font-sans">{description}</p>
        </div>
    );
}
