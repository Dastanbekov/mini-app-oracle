import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CreditCard, CheckCircle, Loader, ExternalLink } from 'lucide-react';
import HumanDesignForm from '../components/human-design/HumanDesignForm';
import BodyGraph from '../components/human-design/BodyGraph';
import CenterModal from '../components/human-design/CenterModal';
import { mockHumanDesignProfile, centerData } from '../data/humanDesignMock';
import { useGameStore } from '../store/gameStore';

export default function HumanDesign() {
    const [profile, setProfile] = useState(null);
    const [selectedCenter, setSelectedCenter] = useState(null);
    const [isPaid, setIsPaid] = useState(false);
    const [paymentUrl, setPaymentUrl] = useState(null);
    const [paymentId, setPaymentId] = useState(null);
    const [error, setError] = useState(null);

    const { createPayment, openPaymentUrl, checkPaymentStatus, paymentLoading } = useGameStore();

    const handleFormSubmit = () => {
        setProfile(mockHumanDesignProfile);
    };

    const handleCenterClick = (centerId) => {
        setSelectedCenter(centerData[centerId]);
    };

    const handlePayment = async () => {
        setError(null);
        const result = await createPayment('human_design_reading');

        if (result.error) {
            if (result.code === 'NOT_CONFIGURED') {
                setIsPaid(true);
                if (window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
                }
            } else {
                setError(result.error);
            }
            return;
        }

        if (result.confirmation_url) {
            setPaymentId(result.payment_id);
            setPaymentUrl(result.confirmation_url);
        }
    };

    const handleCheckPayment = async () => {
        if (!paymentId) return;

        const result = await checkPaymentStatus(paymentId);
        if (result.status === 'succeeded') {
            setIsPaid(true);
            setPaymentUrl(null);
            setPaymentId(null);
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
            }
        } else if (result.status === 'pending') {
            setError('Оплата ещё не завершена');
        }
    };

    return (
        <div className="flex flex-col gap-6 pb-20">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-serif text-accent drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                    Дизайн Человека
                </h2>
                <p className="text-xs text-center text-gray-400 max-w-[200px] mx-auto leading-relaxed">
                    {profile ? "Ваш Рейв-бодиграф рассчитан" : "Познайте свою истинную природу через синтез древних знаний"}
                </p>
            </div>

            <AnimatePresence mode="wait">
                {!profile ? (
                    <HumanDesignForm key="form" onSubmit={handleFormSubmit} />
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        {/* Profile Summary */}
                        <div className="glass-card p-4 rounded-xl border border-accent/20 flex justify-between items-center">
                            <div className="text-left">
                                <div className="text-xs text-gray-400">Тип личности</div>
                                <div className="text-lg font-bold text-white">{profile.type}</div>
                            </div>
                            <div className="h-8 w-px bg-gray-700"></div>
                            <div className="text-right">
                                <div className="text-xs text-gray-400">Профиль</div>
                                <div className="text-lg font-bold text-accent">{profile.profile}</div>
                            </div>
                        </div>

                        {/* BodyGraph */}
                        <div className="relative">
                            <BodyGraph
                                centers={profile.centers}
                                onCenterClick={handleCenterClick}
                            />

                            <div className="absolute top-0 left-0 text-[10px] text-red-400 space-y-1 opacity-80 pointer-events-none">
                                {profile.sections.design.map((p, i) => (
                                    <div key={i}>{p.planet} {p.gate}.{p.line}</div>
                                ))}
                            </div>
                            <div className="absolute top-0 right-0 text-[10px] text-white space-y-1 opacity-80 pointer-events-none text-right">
                                {profile.sections.personality.map((p, i) => (
                                    <div key={i}>{p.gate}.{p.line} {p.planet}</div>
                                ))}
                            </div>
                        </div>

                        {/* Free Preview */}
                        <div className="glass-card p-4 rounded-xl border border-accent/20">
                            <h4 className="font-bold text-accent mb-2">⚡ Ваша стратегия</h4>
                            <p className="text-sm text-gray-300">
                                Как {profile.type}, ваша стратегия — <span className="text-accent">откликаться</span>.
                                Не инициируйте, ждите приглашения. Ваше тело знает правильный ответ.
                            </p>
                        </div>

                        {/* Paywall */}
                        {!isPaid ? (
                            <div className="glass-card p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3">
                                <div className="flex items-center gap-3">
                                    <Lock size={20} className="text-amber-400" />
                                    <div>
                                        <h3 className="font-bold text-white">Полная расшифровка</h3>
                                        <p className="text-xs text-gray-400">Все центры, ворота, карьера, отношения</p>
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-red-400 text-xs">⚠️ {error}</p>
                                )}

                                {paymentUrl ? (
                                    <>
                                        <button
                                            onClick={() => openPaymentUrl(paymentUrl)}
                                            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                                        >
                                            <ExternalLink size={18} />
                                            Перейти к оплате (59₽)
                                        </button>
                                        <button
                                            onClick={handleCheckPayment}
                                            disabled={paymentLoading}
                                            className="w-full py-2 text-sm text-accent hover:text-white transition-colors"
                                        >
                                            {paymentLoading ? <Loader size={16} className="animate-spin mx-auto" /> : "🔄 Проверить оплату"}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handlePayment}
                                        disabled={paymentLoading}
                                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {paymentLoading ? (
                                            <Loader size={18} className="animate-spin" />
                                        ) : (
                                            <>
                                                <CreditCard size={18} />
                                                Получить за 59₽
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-green-400 bg-green-500/10 p-3 rounded-xl"
                            >
                                <CheckCircle size={18} />
                                <span className="font-medium text-sm">Полный разбор отправлен в бота!</span>
                            </motion.div>
                        )}

                        <div className="text-center text-xs text-gray-500">
                            Нажмите на любой центр на карте,<br />чтобы узнать подробности
                        </div>

                        <button
                            onClick={() => { setProfile(null); setIsPaid(false); setPaymentUrl(null); }}
                            className="w-full py-4 text-gray-400 hover:text-white transition-colors"
                        >
                            ← Рассчитать заново
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <CenterModal
                isOpen={!!selectedCenter}
                onClose={() => setSelectedCenter(null)}
                data={selectedCenter}
            />
        </div>
    );
}
