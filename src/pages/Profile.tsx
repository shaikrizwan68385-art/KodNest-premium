export default function Profile() {
    return (
        <div className="max-w-3xl">
            <h2 className="text-32 mb-24 font-serif">Your Profile</h2>
            <div className="card bg-white space-y-32">
                <div className="flex items-center space-x-24">
                    <div className="w-80 h-80 rounded-full bg-black/5 overflow-hidden border border-black/5">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="Avatar" />
                    </div>
                    <div>
                        <h3 className="text-24 font-serif">John Doe</h3>
                        <p className="text-black/40 font-sans">shaik@example.com</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-24 pt-24 border-t border-black/5">
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-black/40 block mb-8 font-sans">Problems Solved</label>
                        <p className="text-24 font-serif">124</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-black/40 block mb-8 font-sans">Assessments Taken</label>
                        <p className="text-24 font-serif">12</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
