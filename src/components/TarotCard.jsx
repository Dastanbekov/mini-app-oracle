import React from "react";
import { motion } from "framer-motion";

export default function TarotCard({ flipped, onFlip, cardData, className = "" }) {
    return (
        <div
            className={`group relative h-[420px] w-[260px] cursor-pointer perspective ${className}`}
            onClick={onFlip}
        >
            <motion.div
                className="relative h-full w-full preserve-3d transition-all duration-700"
                initial={false}
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* === ЗАДНЯЯ СТОРОНА (Рубашка) === */}
                {/* Внешняя граница: Глубокое золото (#996515) */}
                <div
                    className="absolute inset-0 h-full w-full rounded-xl border-2 border-[#996515] bg-[#151515] p-2 shadow-[0_0_15px_rgba(153,101,21,0.2)] backface-hidden"
                    style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                >

                    {/* Внутренняя рамка */}
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-lg border border-[#996515]/30 bg-[#1a1a1c] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-[#1a1a1c] to-[#1a1a1c]">

                        {/* Буква "A" - Яркий блик (#FDD017) с глубокой тенью */}
                        <div className="text-[120px] font-thin text-[#FDD017] drop-shadow-[0_2px_10px_rgba(153,101,21,0.5)] font-serif leading-none select-none opacity-90">
                            A
                        </div>

                    </div>

                    {/* Декоративные уголки - Глубокое золото */}
                    <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[#996515]" />
                    <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#996515]" />
                    <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[#996515]" />
                    <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[#996515]" />
                </div>

                {/* === ПЕРЕДНЯЯ СТОРОНА (Лицо) === */}
                {/* Рамка вокруг фото: Глубокое золото (#996515) */}
                <div
                    className="absolute inset-0 h-full w-full rounded-xl bg-[#111] shadow-2xl border-[3px] border-[#996515] backface-hidden"
                    style={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden"
                    }}
                >
                    {/* Используем image из cardData */}
                    <img
                        src={cardData.image}
                        alt={cardData.name}
                        className="h-full w-full object-cover rounded-lg grayscale-[0.1]"
                    />

                    {/* Плашка с названием */}
                    <div className="absolute bottom-6 left-0 right-0 text-center">
                        {/* Фон плашки: Градиент металла (Темный -> Светлый -> Темный) */}
                        <span className="bg-gradient-to-r from-[#996515] via-[#FDD017] to-[#996515] px-6 py-1 text-[10px] font-bold text-[#1a1a1d] tracking-[0.2em] uppercase shadow-lg border-y border-[#FDD017]/50">
                            {cardData.nameEn || cardData.name}
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
