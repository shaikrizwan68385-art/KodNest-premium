export default function Assessments() {
    return (
        <div>
            <h2 className="text-32 mb-24 font-serif">Mock Assessments</h2>
            <p className="text-black/60 mb-40">Simulate official placement tests from top companies.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                {['Google', 'Amazon', 'Meta', 'Microsoft'].map((company) => (
                    <div key={company} className="card bg-white flex items-center space-x-24">
                        <div className="w-64 h-64 bg-black/5 flex items-center justify-center text-black/20 font-serif text-24">
                            {company[0]}
                        </div>
                        <div>
                            <h4 className="font-medium text-lg">{company} Assessment</h4>
                            <p className="text-sm text-black/40 font-sans">90 mins • 3 Problems</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
