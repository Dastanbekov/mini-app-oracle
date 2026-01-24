import { Link, useLocation } from 'react-router-dom';
import { Sparkles, BookOpen, Layers, Trophy, User } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export default function BottomNav() {
    const location = useLocation();

    const navItems = [
        { name: "Ритуалы", path: "/", icon: Sparkles },
        { name: "Коллекция", path: "/collection", icon: Layers },
        { name: "Достижения", path: "/achievements", icon: Trophy },
        { name: "Знания", path: "/knowledge", icon: BookOpen },
        { name: "Профиль", path: "/profile", icon: User },
    ];

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50">
            <div className="glass rounded-2xl p-2 px-4 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex justify-between items-center max-w-md mx-auto backdrop-blur-xl border border-white/10">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="relative flex flex-col items-center gap-1 p-2 w-16"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-primary/20 rounded-xl neon-border"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <item.icon
                                size={24}
                                className={clsx(
                                    "z-10 transition-colors duration-300",
                                    isActive ? "text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" : "text-gray-500"
                                )}
                            />
                            <span className={clsx(
                                "z-10 text-[10px] font-medium tracking-wide transition-colors",
                                isActive ? "text-primary" : "text-gray-500"
                            )}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
