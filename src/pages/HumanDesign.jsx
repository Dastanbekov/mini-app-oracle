import { motion } from 'framer-motion';
import { UserSearch, MapPin, Clock, Calendar } from 'lucide-react';

export default function HumanDesign() {
    return (
        <div className="flex flex-col gap-6 pb-20">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-serif text-accent drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">Дизайн Человека</h2>
                <p className="text-xs text-center text-gray-400 max-w-[200px] mx-auto leading-relaxed">
                    Познайте свою истинную природу через синтез древних знаний
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 rounded-2xl space-y-4 border border-accent/10"
            >
                <div className="relative group">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent transition-colors" size={18} />
                    <input type="date" className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 pl-10 text-white focus:outline-none focus:border-accent transition-colors" />
                </div>

                <div className="relative group">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent transition-colors" size={18} />
                    <input type="time" className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 pl-10 text-white focus:outline-none focus:border-accent transition-colors" />
                </div>

                <div className="relative group">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent transition-colors" size={18} />
                    <input type="text" className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 pl-10 text-white placeholder-gray-600 focus:outline-none focus:border-accent transition-colors" placeholder="Место рождения" />
                </div>

                <button className="w-full bg-accent text-black font-bold py-4 rounded-xl mt-4 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2">
                    <UserSearch size={20} />
                    Построить Рейв-карту
                </button>
            </motion.div>

            <div className="p-8 border border-dashed border-gray-800 rounded-2xl text-center flex flex-col items-center justify-center min-h-[150px] bg-black/20">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="mb-4 text-gray-700"
                >
                    ☸️
                </motion.div>
                <p className="text-gray-500 text-sm">Заполните форму выше,<br />чтобы увидеть свою карту</p>
            </div>
        </div>
    );
}
