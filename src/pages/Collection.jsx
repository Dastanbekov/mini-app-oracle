import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export default function Collection() {
    const { userId } = useGameStore();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCard, setSelectedCard] = useState(null);

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

    const handleCardClick = (card) => {
        if (card.owned) {
            setSelectedCard(card);
        }
    };

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
                            onClick={() => handleCardClick(card)}
                            className={`glass-card rounded-xl overflow-hidden group relative cursor-pointer ${!card.owned ? 'opacity-60 grayscale cursor-not-allowed' : 'hover:ring-2 hover:ring-purple-500/50'}`}
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
                                        <p className="text-[10px] text-gray-300">Нажмите для подробностей</p>
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

            {/* Card Detail Modal */}
            <AnimatePresence>
                {selectedCard && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setSelectedCard(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 50 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="glass-card max-w-sm w-full rounded-2xl overflow-hidden border border-purple-500/30"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Card Image */}
                            <div className="relative aspect-[3/4] max-h-64">
                                <img
                                    src={selectedCard.image}
                                    alt={selectedCard.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                                {/* Close button */}
                                <button
                                    onClick={() => setSelectedCard(null)}
                                    className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Card Info */}
                            <div className="p-5">
                                <h2 className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 mb-2">
                                    {selectedCard.name}
                                </h2>

                                {selectedCard.nameEn && (
                                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">
                                        {selectedCard.nameEn}
                                    </p>
                                )}

                                <div className="w-12 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 mb-4" />

                                <p className="text-sm text-gray-300 leading-relaxed mb-4">
                                    {selectedCard.desc || 'Таинственная карта Таро...'}
                                </p>

                                {selectedCard.interpretation && (
                                    <details className="text-xs text-gray-400">
                                        <summary className="cursor-pointer text-purple-400 hover:text-purple-300 mb-2">
                                            Подробное значение
                                        </summary>
                                        <div className="space-y-2 mt-2 max-h-32 overflow-y-auto">
                                            {selectedCard.interpretation.main && (
                                                <p><strong>Общее:</strong> {selectedCard.interpretation.main.substring(0, 200)}...</p>
                                            )}
                                        </div>
                                    </details>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
