import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Sparkles } from 'lucide-react';

export default function Numerology() {
    const [date, setDate] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const calculate = () => {
        if (!date) return;
        setLoading(true);
        setResult(null);

        // Simulate calculation time for effect
        setTimeout(() => {
            const digits = date.replace(/\D/g, '').split('').map(Number);
            let sum = digits.reduce((a, b) => a + b, 0);

            // Master numbers logic could go here
            while (sum > 9 && sum !== 11 && sum !== 22) {
                sum = String(sum).split('').map(Number).reduce((a, b) => a + b, 0);
            }
            setResult(sum);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col gap-6 max-w-sm mx-auto">
            <div className="text-center">
                <h2 className="text-3xl font-serif text-white mb-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">Нумерология</h2>
                <p className="text-gray-400 text-xs uppercase tracking-widest">Код вашей судьбы</p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full pointer-events-none" />

                <label className="block text-xs uppercase text-gray-400 mb-2 font-bold tracking-wider">Дата рождения</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-black/30 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all mb-6 text-center font-display tracking-widest"
                />

                <button
                    onClick={calculate}
                    disabled={loading || !date}
                    className="w-full bg-gradient-to-r from-primary to-accent text-black font-bold py-4 rounded-xl hover:shadow-[0_0_20px_rgba(217,70,239,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? "Вычисление..." : (
                            <>
                                <Calculator size={18} /> Рассчитать
                            </>
                        )}
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
            </div>

            <AnimatePresence>
                {result !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="glass-card p-8 rounded-2xl border border-secondary/30 text-center relative"
                    >
                        <div className="absolute inset-0 bg-secondary/5 blur-xl -z-10" />
                        <div className="absolute top-4 right-4 text-secondary animate-pulse">
                            <Sparkles size={24} />
                        </div>

                        <p className="text-gray-300 text-sm mb-4 font-serif">Число Жизненного Пути</p>

                        <div className="relative inline-block">
                            <div className="text-8xl font-bold font-display text-secondary drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] mb-6">
                                {result}
                            </div>
                            {/* Rotating ring behind number */}
                            <div className="absolute inset-[-20px] border border-secondary/20 rounded-full animate-[spin_8s_linear_infinite]" />
                        </div>

                        <p className="text-sm text-gray-300 leading-relaxed border-t border-white/10 pt-4">
                            Люди числа <span className="text-secondary font-bold">{result}</span> обладают скрытым потенциалом и магической интуицией. Вы — проводник энергии в этот мир.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
