import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoonStar, Grid, UserSearch, ArrowRight, Lock, Loader2, CheckCircle } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export default function KnowledgeBase() {
    const { userId } = useGameStore();
    const [showPayment, setShowPayment] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    const items = [
        { name: "Астрология", path: "/astrology", icon: MoonStar, color: "text-purple-400", bg: "bg-purple-500/10" },
        { name: "Матрица Судьбы", path: "/numerology", icon: Grid, color: "text-pink-400", bg: "bg-pink-500/10" },
        { name: "Human Design", path: "/human-design", icon: UserSearch, color: "text-blue-400", bg: "bg-blue-500/10" },
    ];

    const handlePayment = async () => {
        setProcessing(true);
        try {
            // Fake delay
            await new Promise(r => setTimeout(r, 2000));

            const res = await fetch(`${API_URL}/payment/mock`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId })
            });
            const data = await res.json();

            if (data.success) {
                setSuccess(true);
                // Haptic
                if (window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 pb-20 relative">
            <header>
                <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                    База Знаний
                </h1>
                <p className="text-sm text-gray-400">Изучи себя и мир вокруг.</p>
            </header>

            <div className="flex flex-col gap-4">
                {items.map((item) => (
                    <Link to={item.path} key={item.path} className="glass-card p-4 rounded-xl flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center ${item.color}`}>
                                <item.icon size={24} />
                            </div>
                            <span className="font-bold text-lg">{item.name}</span>
                        </div>
                        <ArrowRight className="text-gray-500 group-hover:text-white transition-colors" />
                    </Link>
                ))}

                {/* Paid Item */}
                <button
                    onClick={() => setShowPayment(true)}
                    className="glass-card p-4 rounded-xl flex items-center justify-between group border border-amber-500/30"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
                            <Lock size={24} />
                        </div>
                        <div className="text-left">
                            <span className="font-bold text-lg block text-amber-100">Полная расшифровка</span>
                            <span className="text-xs text-amber-400/70">Узнай своё призвание</span>
                        </div>
                    </div>
                    <span className="bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-full">49 ₽</span>
                </button>
            </div>

            {/* Payment Modal */}
            <AnimatePresence>
                {showPayment && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-gray-900 border border-white/10 p-6 rounded-2xl w-full max-w-sm flex flex-col gap-6 shadow-2xl relative"
                        >
                            {!success ? (
                                <>
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold mb-2">Разблокировать все?</h3>
                                        <p className="text-sm text-gray-400">
                                            Вы получите полный доступ к расшифровке вашей Матрицы, Астро-карты и Дизайна.
                                        </p>
                                    </div>

                                    <div className="bg-white/5 p-4 rounded-xl flex justify-between items-center">
                                        <span>К оплате:</span>
                                        <span className="text-xl font-bold">49.00 RUB</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowPayment(false)}
                                            className="btn flex-1 bg-white/10 hover:bg-white/20"
                                        >
                                            Отмена
                                        </button>
                                        <button
                                            onClick={handlePayment}
                                            disabled={processing}
                                            className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                                        >
                                            {processing ? <Loader2 className="animate-spin" size={18} /> : "Оплатить"}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-6 flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                        <CheckCircle size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-green-400">Успешно!</h3>
                                        <p className="text-sm text-gray-400 mt-2">
                                            Бот отправил вам полную расшифровку в личные сообщения.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => { setShowPayment(false); setSuccess(false); }}
                                        className="btn btn-primary w-full"
                                    >
                                        Отлично
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
