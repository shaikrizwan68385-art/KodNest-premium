import { Link, Outlet, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Code2,
    ClipboardCheck,
    Library,
    User,
    Bell,
    Search,
    CheckCircle2,
    Copy,
    ExternalLink,
    AlertCircle,
    Image as ImageIcon
} from 'lucide-react';

/**
 * Sidebar Navigation Configuration
 */
const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: ClipboardCheck, label: 'History', path: '/dashboard/history' },
    { icon: Code2, label: 'Practice', path: '/dashboard/practice' },
    { icon: ClipboardCheck, label: 'Assessments', path: '/dashboard/assessments' },
    { icon: Library, label: 'Resources', path: '/dashboard/resources' },
    { icon: User, label: 'Profile', path: '/dashboard/profile' },
];

/**
 * AppShell Component
 * High-fidelity layout combining Sidebar, Header, 70/30 Workspace, and Proof Footer.
 */
export default function AppShell() {
    const location = useLocation();

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* 1. Sidebar Navigation */}
            <aside className="w-64 border-r border-black/5 flex flex-col bg-white">
                <div className="p-24">
                    <h2 className="text-24 text-primary font-serif italic">KodNest</h2>
                </div>

                <nav className="flex-1 px-16 space-y-8">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-12 px-12 py-12 transition-colors ${isActive
                                    ? 'bg-primary/5 text-primary border-r-2 border-primary font-medium'
                                    : 'text-black/40 hover:bg-black/5 hover:text-black/60 font-medium'
                                    }`}
                            >
                                <item.icon className={`w-20 h-20 ${isActive ? 'text-primary' : 'text-black/20'}`} />
                                <span className="font-sans">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-16 border-t border-black/5">
                    <div className="flex items-center space-x-12 px-12 py-8 bg-black/[0.02] border border-black/5">
                        <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif text-xs">
                            JD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-black truncate">John Doe</p>
                            <p className="text-[10px] uppercase tracking-wider text-black/40 truncate">Free Member</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* 2. Primary Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

                {/* Header (Top Bar) */}
                <header className="h-64 border-b border-black/5 bg-white flex items-center justify-between px-40">
                    <div className="flex items-center space-x-16">
                        <span className="text-xs font-sans uppercase tracking-[0.2em] text-black/40">Step 2 / 9</span>
                        <div className="h-12 w-px bg-black/10" />
                        <h1 className="text-16 font-serif">Setup Platform Shell</h1>
                    </div>

                    <div className="flex items-center space-x-24">
                        <div className="flex items-center space-x-8 px-12 py-4 bg-primary/5 border border-primary/10 rounded-full">
                            <div className="w-6 h-6 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">In Progress</span>
                        </div>
                        <div className="h-24 w-px bg-black/10" />
                        <button className="text-black/40 hover:text-black/60"><Search className="w-18 h-18" /></button>
                        <button className="text-black/40 hover:text-black/60"><Bell className="w-18 h-18" /></button>
                    </div>
                </header>

                {/* Hybrid Workspace (70/30 Split) */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Primary Workspace (70%) */}
                    <main className="flex-[0.7] overflow-y-auto p-40 bg-background">
                        <div className="max-w-4xl mx-auto space-y-40">
                            {/* Context Header */}
                            <div className="mb-40">
                                <h2 className="text-40 md:text-56 mb-8 font-serif leading-tight">Platform Infrastructure</h2>
                                <p className="text-black/40 font-sans">Establish the core navigation and dashboard layout for the platform.</p>
                            </div>

                            {/* Page Content */}
                            <div className="space-y-24 pb-120">
                                <Outlet />
                            </div>
                        </div>
                    </main>

                    {/* Secondary Panel (30%) */}
                    <aside className="flex-[0.3] border-l border-black/5 bg-white overflow-y-auto p-32 space-y-32">
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-black/30 mb-16">Step Explanation</h4>
                            <p className="text-sm text-black/60 leading-relaxed">
                                Create a robust application shell with sidebar navigation,
                                header status indicators, and a flexible content area.
                            </p>
                        </div>

                        <div className="space-y-16">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-black/30">Action Prompt</h4>
                            <div className="p-16 bg-black/[0.02] border border-black/5 font-mono text-xs text-black/60 leading-relaxed relative group">
                                Create an app shell for the dashboard...
                                <button className="absolute top-8 right-8 p-4 bg-white border border-black/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Copy className="w-12 h-12" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-12">
                            <button className="btn btn-primary text-xs py-12 w-full flex items-center justify-center gap-8">
                                <ExternalLink className="w-14 h-14" />
                                Build in Lovable
                            </button>
                            <button className="btn btn-secondary text-xs py-12 w-full flex items-center justify-center gap-8">
                                <CheckCircle2 className="w-14 h-14" />
                                It Worked
                            </button>
                            <div className="grid grid-cols-2 gap-8">
                                <button className="btn border border-black/10 text-black/40 text-[10px] py-8 flex items-center justify-center gap-4 hover:bg-black/5">
                                    <AlertCircle className="w-12 h-12" /> Error
                                </button>
                                <button className="btn border border-black/10 text-black/40 text-[10px] py-8 flex items-center justify-center gap-4 hover:bg-black/5">
                                    <ImageIcon className="w-12 h-12" /> Screenshot
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* 3. Proof Footer (Persistent Bottom Bar) */}
                <footer className="absolute bottom-0 left-0 right-0 h-80 bg-white border-t border-black/5 px-40 flex items-center justify-between z-10 shadow-lg">
                    <div className="flex items-center space-x-40">
                        <ProofItem label="UI Built" />
                        <ProofItem label="Logic Working" />
                        <ProofItem label="Test Passed" />
                        <ProofItem label="Deployed" />
                    </div>

                    <div className="flex items-center space-x-16">
                        <span className="text-xs text-black/40 italic font-sans">Each step requires proof input</span>
                        <button className="btn btn-primary text-xs py-10 px-24">Submit Step 2</button>
                    </div>
                </footer>
            </div>
        </div>
    );
}

function ProofItem({ label }: { label: string }) {
    return (
        <div className="flex items-center space-x-12 cursor-pointer group">
            <div className="w-20 h-20 border-2 border-black/10 rounded-sm flex items-center justify-center group-hover:border-primary/40 transition-colors">
                {/* Empty checkbox */}
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-black/40 group-hover:text-black/60 transition-colors">{label}</span>
        </div>
    );
}
