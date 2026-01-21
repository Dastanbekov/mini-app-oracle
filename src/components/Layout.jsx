import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function Layout() {
    return (
        <div className="min-h-screen pb-24 relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="p-4 relative z-10 max-w-md mx-auto">
                <header className="flex justify-center py-4 mb-4">
                    <h1 className="font-serif text-2xl font-bold bg-gradient-to-r from-primary via-white to-accent bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                        AZALEA ORACLE
                    </h1>
                </header>
                <Outlet />
            </div>
            <BottomNav />
        </div>
    );
}
