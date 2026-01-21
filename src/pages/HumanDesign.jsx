import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HumanDesignForm from '../components/human-design/HumanDesignForm';
import BodyGraph from '../components/human-design/BodyGraph';
import CenterModal from '../components/human-design/CenterModal';
import { mockHumanDesignProfile, centerData } from '../data/humanDesignMock';

export default function HumanDesign() {
    const [profile, setProfile] = useState(null);
    const [selectedCenter, setSelectedCenter] = useState(null);

    const handleFormSubmit = () => {
        setProfile(mockHumanDesignProfile);
    };

    const handleCenterClick = (centerId) => {
        setSelectedCenter(centerData[centerId]);
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

                        {/* Two Column Layout: Design / BodyGraph / Personality */}
                        <div className="relative">
                            <BodyGraph 
                                centers={profile.centers} 
                                onCenterClick={handleCenterClick}
                            />
                            
                            {/* Overlay Planet Lists (Absolute positioning for style) */}
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

                        <div className="text-center text-xs text-gray-500">
                            Нажмите на любой центр на карте,<br/>чтобы узнать подробности
                        </div>

                        <button 
                            onClick={() => setProfile(null)}
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
