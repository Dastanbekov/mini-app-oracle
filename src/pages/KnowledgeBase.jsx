import { Link } from 'react-router-dom';
import { MoonStar, Grid, UserSearch, ArrowRight, Coins } from 'lucide-react';

export default function KnowledgeBase() {
    const items = [
        { name: "Астрология", path: "/astrology", icon: MoonStar, color: "text-purple-400", bg: "bg-purple-500/10", desc: "Звёздный прогноз" },
        { name: "Матрица Судьбы", path: "/numerology", icon: Grid, color: "text-pink-400", bg: "bg-pink-500/10", desc: "22 Аркана Таро" },
        { name: "Human Design", path: "/human-design", icon: UserSearch, color: "text-blue-400", bg: "bg-blue-500/10", desc: "Дизайн Человека" },
        { name: "Taro Coin", path: "/taro-coin", icon: Coins, color: "text-yellow-400", bg: "bg-yellow-500/10", desc: "Криптовалюта и обмен" },
    ];

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
                    <Link to={item.path} key={item.path} className="glass-card p-4 rounded-xl flex items-center justify-between group hover:border-accent/30 transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center ${item.color}`}>
                                <item.icon size={24} />
                            </div>
                            <div>
                                <span className="font-bold text-lg block">{item.name}</span>
                                <span className="text-xs text-gray-500">{item.desc}</span>
                            </div>
                        </div>
                        <ArrowRight className="text-gray-500 group-hover:text-white transition-colors" />
                    </Link>
                ))}
            </div>
        </div>
    );
}
