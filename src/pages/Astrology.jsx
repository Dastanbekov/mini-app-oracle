import { motion } from 'framer-motion';

const SIGNS = [
    { name: "Овен", date: "21.03 - 19.04", icon: "♈" },
    { name: "Телец", date: "20.04 - 20.05", icon: "♉" },
    { name: "Близнецы", date: "21.05 - 20.06", icon: "♊" },
    { name: "Рак", date: "21.06 - 22.07", icon: "♋" },
    { name: "Лев", date: "23.07 - 22.08", icon: "♌" },
    { name: "Дева", date: "23.08 - 22.09", icon: "♍" },
    { name: "Весы", date: "23.09 - 22.10", icon: "♎" },
    { name: "Скорпион", date: "23.10 - 21.11", icon: "♏" },
    { name: "Стрелец", date: "22.11 - 21.12", icon: "♐" },
    { name: "Козерог", date: "22.12 - 19.01", icon: "♑" },
    { name: "Водолей", date: "20.01 - 18.02", icon: "♒" },
    { name: "Рыбы", date: "19.02 - 20.03", icon: "♓" }
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function Astrology() {
    return (
        <div className="pb-8">
            <h2 className="text-3xl font-serif text-center mb-2 bg-gradient-to-r from-indigo-300 via-white to-purple-300 bg-clip-text text-transparent">Звездный Оракул</h2>
            <p className="text-center text-gray-400 text-sm mb-8">Выберите свой знак зодиака</p>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-3 gap-3"
            >
                {SIGNS.map((sign, index) => (
                    <motion.div
                        key={index}
                        variants={item}
                        whileHover={{ scale: 1.05, borderColor: "rgba(217, 70, 239, 0.5)" }}
                        whileTap={{ scale: 0.95 }}
                        className="aspect-[4/5] glass-card rounded-2xl flex flex-col items-center justify-center p-2 text-center cursor-pointer group hover:bg-white/5 transition-all"
                        onClick={() => alert(`✨ Прогноз для ${sign.name}:\n\nЗвезды шепчут об удаче в делах любовных. Будьте внимательны к знакам судьбы...`)}
                    >
                        <span className="text-4xl mb-2 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all">{sign.icon}</span>
                        <span className="text-xs font-bold font-display text-gray-200 group-hover:text-primary transition-colors">{sign.name}</span>
                        <span className="text-[9px] text-gray-500 mt-1">{sign.date}</span>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
