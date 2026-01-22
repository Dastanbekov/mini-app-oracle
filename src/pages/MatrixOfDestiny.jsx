import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, Sparkles, User, Calendar, Mars, Venus } from 'lucide-react';

export default function MatrixOfDestiny() {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [gender, setGender] = useState('female');
    const [loading, setLoading] = useState(false);
    const [isCalculated, setIsCalculated] = useState(false);

    const calculate = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate calculation
        setTimeout(() => {
            setLoading(false);
            setIsCalculated(true);
        }, 2000);
    };

    return (
        <div className="flex flex-col gap-6 pb-20">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-serif text-accent drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                    Матрица Судьбы
                </h2>
                <p className="text-xs text-center text-gray-400 max-w-[250px] mx-auto leading-relaxed">
                    22 Аркана раскроют ваше предназначение, таланты и кармические задачи
                </p>
            </div>

            <AnimatePresence mode="wait">
                {!isCalculated ? (
                    <motion.form
                        key="form"
                        onSubmit={calculate}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass-card p-6 rounded-2xl space-y-4 border border-accent/10"
                    >
                        <div className="relative group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent transition-colors pointer-events-none" size={18} />
                            <input
                                required
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 pl-10 text-white placeholder-gray-600 focus:outline-none focus:border-accent transition-colors appearance-none"
                                placeholder="Ваше Имя"
                            />
                        </div>

                        <div className="relative group">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent transition-colors pointer-events-none" size={18} />
                            <input
                                required
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 pl-10 text-white focus:outline-none focus:border-accent transition-colors appearance-none min-h-[46px]"
                                style={{ colorScheme: 'dark' }}
                            />
                        </div>

                        {/* Gender Toggle */}
                        <div className="flex bg-black/40 rounded-xl p-1 border border-gray-700">
                            <button
                                type="button"
                                onClick={() => setGender('female')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${gender === 'female' ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                <Venus size={16} /> Женский
                            </button>
                            <button
                                type="button"
                                onClick={() => setGender('male')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${gender === 'male' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                <Mars size={16} /> Мужской
                            </button>
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
                                    ❄️
                                </motion.div>
                            ) : (
                                <>
                                    <Grid size={20} />
                                    Рассчитать Матрицу
                                </>
                            )}
                        </button>
                    </motion.form>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        {/* Placeholder Matrix Visualization */}
                        <div className="relative aspect-square w-full max-w-[300px] mx-auto">
                            {/* Rotating background squares */}
                            <div className="absolute inset-0 border-2 border-accent/20 rotate-45 rounded-3xl animate-[spin_60s_linear_infinite]" />
                            <div className="absolute inset-4 border border-primary/20 rotate-0 rounded-2xl" />

                            {/* Center Content */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-4xl mb-2">💠</div>
                                    <div className="text-xs text-gray-400">Личный Квадрат</div>
                                    <div className="text-xl font-bold text-white mt-1">5 • 18 • 7</div>
                                </div>
                            </div>

                            {/* Corners */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 bg-[#0f0718] px-2 text-accent font-bold text-sm">22</div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-3 bg-[#0f0718] px-2 text-red-500 font-bold text-sm">8</div>
                            <div className="absolute left-0 top-1/2 -translate-x-3 -translate-y-1/2 bg-[#0f0718] px-2 text-purple-500 font-bold text-sm">11</div>
                            <div className="absolute right-0 top-1/2 translate-x-3 -translate-y-1/2 bg-[#0f0718] px-2 text-yellow-500 font-bold text-sm">5</div>
                        </div>

                        <div className="glass-card p-5 rounded-xl border border-accent/20 space-y-3">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <Sparkles size={16} className="text-accent" /> Ваше Предназначение
                            </h3>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                Ваш путь лежит через духовное развитие и наставничество. Энергия <span className="text-accent">5 Аркана (Жрец)</span> указывает на важность передачи знаний и соблюдение традиций.
                            </p>
                        </div>

                        <button
                            onClick={() => setIsCalculated(false)}
                            className="w-full py-4 text-gray-400 hover:text-white transition-colors"
                        >
                            ← Рассчитать заново
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
