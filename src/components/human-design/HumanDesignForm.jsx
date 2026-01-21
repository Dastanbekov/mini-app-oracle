import { motion } from 'framer-motion';
import { UserSearch, MapPin, Clock, Calendar, User } from 'lucide-react';
import { useState } from 'react';

export default function HumanDesignForm({ onSubmit }) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate calculation delay
        setTimeout(() => {
            setLoading(false);
            onSubmit();
        }, 1500);
    };

    return (
        <motion.form 
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-2xl space-y-4 border border-accent/10"
        >
             <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent transition-colors" size={18} />
                <input required type="text" className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 pl-10 text-white placeholder-gray-600 focus:outline-none focus:border-accent transition-colors" placeholder="Ваше Имя" />
            </div>

            <div className="relative group">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent transition-colors" size={18} />
                <input required type="date" className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 pl-10 text-white focus:outline-none focus:border-accent transition-colors" />
            </div>

            <div className="relative group">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent transition-colors" size={18} />
                <input required type="time" className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 pl-10 text-white focus:outline-none focus:border-accent transition-colors" />
            </div>

            <div className="relative group">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent transition-colors" size={18} />
                <input required type="text" className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 pl-10 text-white placeholder-gray-600 focus:outline-none focus:border-accent transition-colors" placeholder="Место рождения" />
            </div>

            <button 
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-black font-bold py-4 rounded-xl mt-4 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                        ☸️
                    </motion.div>
                ) : (
                    <>
                        <UserSearch size={20} />
                        Построить Рейв-карту
                    </>
                )}
            </button>
        </motion.form>
    );
}
