import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function CenterModal({ isOpen, onClose, data }) {
    if (!data) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-50">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        
                        {/* Modal */}
                        <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="bg-[#1a1b26] w-full max-w-md max-h-[85vh] overflow-y-auto rounded-3xl border border-gray-800 shadow-2xl pointer-events-auto"
                            >
                                {/* Header */}
                                <div className="sticky top-0 bg-[#1a1b26]/95 backdrop-blur-md p-6 border-b border-gray-800 flex justify-between items-center z-10">
                                    <h3 className="text-xl font-bold text-white">{data.title}</h3>
                                    <button 
                                        onClick={onClose}
                                        className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                                    >
                                        <X size={20} className="text-gray-300" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-6">
                                    {/* Theme Block */}
                                    <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/20">
                                        <div className="text-xs text-blue-400 uppercase tracking-widest font-bold mb-1">Темы</div>
                                        <div className="text-blue-100">{data.theme}</div>
                                    </div>

                                    {/* Physiology Block */}
                                    <div className="bg-green-900/20 p-4 rounded-xl border border-green-500/20">
                                        <div className="text-xs text-green-400 uppercase tracking-widest font-bold mb-1">Физиология</div>
                                        <div className="text-green-100">{data.physiology}</div>
                                    </div>

                                    {/* Description Block */}
                                    <div className="bg-[#2a2b36] p-5 rounded-xl border border-gray-700">
                                        <div className="text-gray-300 leading-relaxed text-sm">
                                            {data.desc}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
