import { motion } from 'framer-motion';

// Adapted to match site theme (Amber/Slate) instead of hardcoded Gold
export default function TarotCard({ flipped, onFlip, cardData, className = "" }) {
    return (
        <div
            className={`group relative h-[420px] w-[260px] cursor-pointer perspective ${className}`}
            onClick={onFlip}
        >
            <motion.div
                initial={false}
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="relative h-full w-full preserve-3d"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* === BACK SIDE (Shirt) === */}
                {/* Outer Border: Amber-700 */}
                <div className="absolute inset-0 h-full w-full rounded-xl border-2 border-amber-700 bg-slate-900 p-2 shadow-[0_0_15px_rgba(180,83,9,0.2)] backface-hidden"
                    style={{ backfaceVisibility: 'hidden' }}>

                    {/* Inner Frame */}
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-lg border border-amber-700/30 bg-slate-800 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-700/20 via-slate-800 to-slate-900">

                        {/* Letter "A" - Amber-400 with shadow */}
                        <div className="text-[120px] font-thin text-amber-400 drop-shadow-[0_2px_10px_rgba(180,83,9,0.5)] font-serif leading-none select-none opacity-90">
                            A
                        </div>

                    </div>

                    {/* Decorative Corners */}
                    <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-amber-600" />
                    <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-amber-600" />
                    <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-amber-600" />
                    <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-amber-600" />
                </div>

                {/* === FRONT SIDE (Face) === */}
                {/* Frame: Amber-700/Gold */}
                <div className="absolute inset-0 h-full w-full rounded-xl bg-slate-900 shadow-2xl border-[3px] border-amber-600 backface-hidden"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>

                    {/* Image */}
                    <img
                        src={cardData.image}
                        alt={cardData.name}
                        className="h-full w-full object-cover rounded-lg grayscale-[0.1]"
                    />

                    {/* Nameplate */}
                    <div className="absolute bottom-6 left-0 right-0 text-center">
                        {/* Gradient Metal Background */}
                        <span className="bg-gradient-to-r from-amber-700 via-amber-300 to-amber-700 px-6 py-1 text-[10px] font-bold text-slate-900 tracking-[0.2em] uppercase shadow-lg border-y border-amber-300/50">
                            {cardData.nameEn || cardData.name}
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
