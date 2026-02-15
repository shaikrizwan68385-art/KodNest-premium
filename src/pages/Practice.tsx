export default function Practice() {
    return (
        <div>
            <h2 className="text-32 mb-24 font-serif">Practice Problems</h2>
            <p className="text-black/60 mb-40">Hone your skills with curated DSA problems.</p>
            <div className="space-y-16">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="card bg-white flex justify-between items-center group cursor-pointer hover:border-primary/20">
                        <div>
                            <h4 className="font-medium">Problem #{i}: Two Sum Variation</h4>
                            <p className="text-xs text-black/40 font-sans">Array, Hash Table • Easy</p>
                        </div>
                        <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">Solve &rarr;</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
