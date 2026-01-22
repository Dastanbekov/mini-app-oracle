import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Sparkles, Users, Coins, Baby, User } from 'lucide-react';

export default function Numerology() {
    const [activeTab, setActiveTab] = useState('general'); // general, compatibility, financial, children
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // Form States
    const [date1, setDate1] = useState('');
    const [date2, setDate2] = useState(''); // For compatibility
    const [name, setName] = useState('');

    const tabs = [
        { id: 'general', label: 'Общая', icon: User },
        { id: 'compatibility', label: 'Совместимость', icon: Users },
        { id: 'financial', label: 'Финансовая', icon: Coins },
        { id: 'children', label: 'Детская', icon: Baby },
    ];

    const calculate = (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        // Simulate calc
        setTimeout(() => {
            setLoading(false);
            setResult({ tab: activeTab, date1, date2 });
        }, 1500);
    };

    const reset = () => {
        setResult(null);
        setDate1('');
        setDate2('');
    };

    return (
        <div className="flex flex-col gap-6 pb-20">
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-serif text-accent drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                    Матрица Судьбы
                </h2>
                <p className="text-xs text-center text-gray-400 max-w-[250px] mx-auto leading-relaxed">
                    22 Аркана. Полная карта вашей жизни.
                </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1 bg-black/40 rounded-xl border border-gray-800 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setResult(null); }}
                        className={`flex-1 min-w-[80px] flex flex-col items-center gap-1 py-3 px-2 rounded-lg transition-all text-[10px] font-medium ${activeTab === tab.id
                            ? 'bg-accent/10 text-accent ring-1 ring-accent/30'
                            : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        <tab.icon size={18} />
                        <span className="whitespace-nowrap">{tab.label}</span>
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {!result ? (
                    <motion.form
                        key="form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onSubmit={calculate}
                        className="glass-card p-6 rounded-2xl space-y-5 border border-accent/10"
                    >
                        <h3 className="text-lg text-white font-medium flex items-center gap-2">
                            {tabs.find(t => t.id === activeTab).label} матрица
                        </h3>

                        {/* Input 1 - Always present (Your Date) */}
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 uppercase tracking-widest pl-1">
                                {activeTab === 'compatibility' ? 'Ваша дата рождения' : 'Дата рождения'}
                            </label>
                            <input
                                required
                                type="date"
                                value={date1}
                                onChange={(e) => setDate1(e.target.value)}
                                className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 pl-4 text-white focus:outline-none focus:border-accent transition-colors appearance-none min-h-[46px]"
                                style={{ colorScheme: 'dark' }}
                            />
                        </div>

                        {/* Input 2 - Only for Compatibility */}
                        {activeTab === 'compatibility' && (
                            <div className="space-y-2">
                                <label className="text-xs text-gray-400 uppercase tracking-widest pl-1">
                                    Дата рождения партнера
                                </label>
                                <input
                                    required
                                    type="date"
                                    value={date2}
                                    onChange={(e) => setDate2(e.target.value)}
                                    className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 pl-4 text-white focus:outline-none focus:border-accent transition-colors appearance-none min-h-[46px]"
                                    style={{ colorScheme: 'dark' }}
                                />
                            </div>
                        )}

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
                                    <Sparkles size={20} />
                                    Рассчитать
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
                        {/* Result Mockup - Adapts visually to tab */}
                        <div className="glass-card p-6 rounded-2xl border border-accent/20 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                {(() => {
                                    const Icon = tabs.find(t => t.id === activeTab).icon;
                                    return <Icon size={100} />;
                                })()}
                            </div>

                            <div className="relative z-10">
                                <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">Ваш Аркан</div>
                                <div className="text-5xl font-bold font-display text-white mb-2 text-glow">
                                    {/* Mock Random Arcana based on date */}
                                    {Math.floor(Math.random() * 22) + 1}
                                </div>
                                <div className="text-accent font-medium mb-4">
                                    {activeTab === 'general' && "Энергия Личности"}
                                    {activeTab === 'compatibility' && "Энергия Пары"}
                                    {activeTab === 'financial' && "Денежный Поток"}
                                    {activeTab === 'children' && "Детско-родительская карма"}
                                </div>

                                <div className="h-px bg-white/10 w-full my-4" />

                                <p className="text-sm text-gray-300 leading-relaxed text-left">
                                    {activeTab === 'general' && "Вы обладаете сильной интуицией и способностью видеть скрытые смыслы. Ваша задача — научиться доверять себе."}
                                    {activeTab === 'compatibility' && "Ваш союз обладает потенциалом для духовного роста. Вы вместе, чтобы научить друг друга терпению."}
                                    {activeTab === 'financial' && "Деньги приходят к вам через передачу знаний и коммуникацию. Избегайте изолированности."}
                                    {activeTab === 'children' && "Ваш ребенок — ваш учитель. Не давите на него авторитетом, дайте свободу самовыражения."}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={reset}
                            className="w-full py-4 text-gray-400 hover:text-white transition-colors"
                        >
                            ← Вернуться к расчету
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
