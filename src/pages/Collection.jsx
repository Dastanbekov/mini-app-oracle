import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export default function Collection() {
    const { userId } = useGameStore();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/inventory?user_id=${userId}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCards(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [userId]);

    return (
        <div className="flex flex-col gap-6 pb-20 min-h-[80vh]">
            <header>
                <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                    Коллекция
                </h1>
                <p className="text-sm text-gray-400">
                    Собрано: {cards.filter(c => c.owned).length} / {cards.length}
                </p>
            </header>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="animate-spin text-primary" size={32} />
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {cards.map((card) => (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.05 }}
                            className={`glass-card rounded-xl overflow-hidden group relative ${!card.owned ? 'opacity-60 grayscale' : ''}`}
                        >
                            <div className="relative aspect-[2/3]">
                                <img src={card.image} alt={card.name} className="w-full h-full object-cover" />

                                {!card.owned && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <span className="text-3xl opacity-50">🔒</span>
                                    </div>
                                )}

                                {card.owned && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-sm font-bold text-white shadow-black drop-shadow-md">{card.name}</p>
                                    </div>
                                )}

                                {card.owned && card.rarity === 'gold' && (
                                    <div className="absolute top-2 right-2 text-yellow-500 animate-pulse">✨</div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
