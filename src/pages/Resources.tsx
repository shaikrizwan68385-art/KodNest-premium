export default function Resources() {
    return (
        <div>
            <h2 className="text-32 mb-24 font-serif">Learning Resources</h2>
            <p className="text-black/60 mb-40">Curated roadmaps and study materials for your preparation.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
                {['DSA Roadmap', 'System Design', 'Behavioral Tips', 'Resume Guide'].map((res) => (
                    <div key={res} className="card bg-white border-l-4 border-l-primary">
                        <h4 className="font-medium mb-8">{res}</h4>
                        <p className="text-xs text-black/40 font-sans mb-16">PDF • 12 Pages</p>
                        <button className="text-primary text-sm font-medium hover:underline">Download &rarr;</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
