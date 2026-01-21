import { motion } from 'framer-motion';

// SVG Paths for Centers (Approximated for a clean look)
const CENTERS = [
    { id: 'head', type: 'triangle-up', x: 250, y: 70, size: 60, color: '#FCD34D' }, // Yellow if defined
    { id: 'ajna', type: 'triangle-down', x: 250, y: 160, size: 60, color: '#4ADE80' }, // Green if defined
    { id: 'throat', type: 'square', x: 250, y: 260, size: 50, color: '#B45309' }, // Brown if defined
    { id: 'g', type: 'diamond', x: 250, y: 380, size: 50, color: '#FCD34D' }, // Yellow if defined
    { id: 'heart', type: 'triangle-small', x: 340, y: 360, size: 30, color: '#EF4444' }, // Red if defined (Ego/Heart usually red)
    { id: 'sacral', type: 'square', x: 250, y: 520, size: 50, color: '#EF4444' }, // Red if defined
    { id: 'spleen', type: 'triangle-left', x: 140, y: 480, size: 50, color: '#B45309' }, // Brown if defined
    { id: 'solar', type: 'triangle-right', x: 360, y: 480, size: 50, color: '#B45309' }, // Brown if defined
    { id: 'root', type: 'square', x: 250, y: 650, size: 50, color: '#B45309' }, // Brown if defined
];

// Helper to draw shapes
const Shape = ({ type, x, y, size, fill, onClick }) => {
    let path = '';
    const h = size;
    const w = size;

    if (type === 'triangle-up') {
        path = `M${x},${y - h / 2} L${x + w / 2},${y + h / 2} L${x - w / 2},${y + h / 2} Z`;
    } else if (type === 'triangle-down') {
        path = `M${x},${y + h / 2} L${x + w / 2},${y - h / 2} L${x - w / 2},${y - h / 2} Z`;
    } else if (type === 'square') {
        path = `M${x - w / 2},${y - h / 2} H${x + w / 2} V${y + h / 2} H${x - w / 2} Z`;
    } else if (type === 'diamond') {
        path = `M${x},${y - h / 2 * 1.4} L${x + w / 2 * 1.4},${y} L${x},${y + h / 2 * 1.4} L${x - w / 2 * 1.4},${y} Z`;
    } else if (type === 'triangle-small') { // Heart center
        path = `M${x},${y - h / 2} L${x + w / 2},${y + h / 2} L${x - w / 2},${y + h / 2} Z`;
    } else if (type === 'triangle-left') {
        path = `M${x + w / 2},${y - h / 2} L${x + w / 2},${y + h / 2} L${x - w / 2},${y} Z`;
    } else if (type === 'triangle-right') {
        path = `M${x - w / 2},${y - h / 2} L${x + w / 2},${y} L${x - w / 2},${y + h / 2} Z`;
    }

    return (
        <motion.path
            d={path}
            fill={fill}
            stroke="#333"
            strokeWidth="2"
            whileHover={{ scale: 1.1, filter: "brightness(1.2)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="cursor-pointer transition-colors"
        />
    );
};

// Connections (Channels) - Purely visual lines for now
const CHANNELS = [
    { from: 'head', to: 'ajna' },
    { from: 'ajna', to: 'throat' },
    { from: 'throat', to: 'g' },
    { from: 'g', to: 'sacral' },
    { from: 'sacral', to: 'root' },
    { from: 'g', to: 'heart' },
    { from: 'heart', to: 'throat' },
    { from: 'spleen', to: 'root' },
    { from: 'spleen', to: 'sacral' },
    { from: 'spleen', to: 'g' },
    { from: 'spleen', to: 'throat' },
    { from: 'solar', to: 'root' },
    { from: 'solar', to: 'sacral' },
    { from: 'solar', to: 'throat' },
];

// Helper to get coords by ID
const getCoords = (id) => {
    const c = CENTERS.find(x => x.id === id);
    return c ? { x: c.x, y: c.y } : { x: 0, y: 0 };
};

export default function BodyGraph({ centers, onCenterClick }) {
    return (
        <div className="w-full max-w-[400px] mx-auto relative aspect-[1/1.6]">
            <svg viewBox="0 0 500 750" className="w-full h-full drop-shadow-xl">
                {/* Human Silhouette - Stylized Outline */}
                <path
                    d="M250,10 
                       C290,10 320,40 320,80 
                       C320,110 300,130 290,140 
                       C340,150 400,180 420,240 
                       C440,300 430,450 410,550
                       C400,600 380,730 380,730
                       L120,730
                       C120,730 100,600 90,550
                       C70,450 60,300 80,240
                       C100,180 160,150 210,140
                       C200,130 180,110 180,80
                       C180,40 210,10 250,10 Z"
                    fill="none"
                    stroke="#334155" // Slate-700
                    strokeWidth="2"
                    opacity="0.5"
                />

                {/* Background Lines (Channels) */}
                {CHANNELS.map((ch, i) => {
                    const start = getCoords(ch.from);
                    const end = getCoords(ch.to);
                    return (
                        <line
                            key={i}
                            x1={start.x} y1={start.y}
                            x2={end.x} y2={end.y}
                            stroke="#333"
                            strokeWidth="4"
                            opacity="0.5"
                        />
                    );
                })}

                {/* Centers */}
                {CENTERS.map((center) => {
                    const isDefined = centers[center.id];
                    return (
                        <Shape
                            key={center.id}
                            type={center.type}
                            x={center.x}
                            y={center.y}
                            size={center.size}
                            fill={isDefined ? center.color : "#FFF"} // White if undefined
                            onClick={() => onCenterClick(center.id)}
                        />
                    );
                })}
            </svg>
        </div>
    );
}
