import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';
import { Loader2, Trophy, Lock, Sparkles } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export default function Achievements() {
    const { userId } = useGameStore();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/achievements?user_id=${userId}`)
            .then(res => res.json())
            .then(result => {
                setData(result);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [userId]);

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'cups': return '🏆';
            case 'collection': return '🃏';
            case 'daily': return '📅';
            case 'spending': return '💰';
            default: return '⭐';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'cups': return 'from-amber-500 to-orange-600';
            case 'collection': return 'from-purple-500 to-pink-600';
            case 'daily': return 'from-blue-500 to-cyan-600';
            case 'spending': return 'from-green-500 to-emerald-600';
            default: return 'from-gray-500 to-slate-600';
        }
    };

    return (
        <div className="flex flex-col gap-6 pb-20 min-h-[80vh]">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
                        Достижения
                    </h1>
                    {data && (
                        <p className="text-sm text-gray-400">
                            Получено: {data.total_unlocked} / {data.total_achievements}
                        </p>
                    )}
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Trophy className="text-amber-400" size={24} />
                </div>
            </header>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="animate-spin text-primary" size={32} />
                </div>
            ) : data ? (
                <div className="flex flex-col gap-4">
                    {/* Unlocked Achievements */}
                    {data.unlocked.length > 0 && (
                        <div className="flex flex-col gap-3">
                            <h2 className="text-lg font-bold text-white/80 flex items-center gap-2">
                                <Sparkles size={18} className="text-amber-400" />
                                Разблокировано
                            </h2>
                            {data.unlocked.map((achievement, idx) => (
                                <motion.div
                                    key={achievement.code}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={`glass-card p-4 rounded-xl border border-amber-500/30 bg-gradient-to-r ${getCategoryColor(achievement.category)} bg-opacity-10`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-3xl">
                                            {getCategoryIcon(achievement.category)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-white">{achievement.name}</div>
                                            <div className="text-xs text-white/60">{achievement.description}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-amber-300 font-bold">
                                                +{achievement.reward_amount}
                                            </div>
                                            <div className="text-xs text-white/50">
                                                {achievement.reward_type === 'dust' ? '💎 Пыль' : '🪙 Монеты'}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Locked Achievements */}
                    {data.locked.length > 0 && (
                        <div className="flex flex-col gap-3 mt-4">
                            <h2 className="text-lg font-bold text-white/50 flex items-center gap-2">
                                <Lock size={18} />
                                Заблокировано
                            </h2>
                            {data.locked.map((achievement, idx) => (
                                <motion.div
                                    key={achievement.code}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className="glass-card p-4 rounded-xl opacity-60 border border-white/5"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl grayscale opacity-50">
                                            {getCategoryIcon(achievement.category)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-white/70">{achievement.name}</div>
                                            <div className="text-xs text-white/40">{achievement.description}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-gray-400 font-bold">
                                                +{achievement.reward_amount}
                                            </div>
                                            <div className="text-xs text-white/30">
                                                {achievement.reward_type === 'dust' ? '💎 Пыль' : '🪙 Монеты'}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center text-gray-500 py-10">
                    Не удалось загрузить достижения
                </div>
            )}
        </div>
    );
}
