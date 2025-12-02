import React from 'react';
import { Button } from '@/components/ui/button';

interface HeroProps {
    isActive: boolean;
    onExplore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ isActive, onExplore }) => {
    return (
        <section className={`section-panel bg-gradient-1 ${isActive ? 'active' : ''}`} id="section-0">
            <div className="bg-pattern"></div>
            <i className="floating-icon fas fa-calendar-check" style={{ top: '10%', left: '5%' }}></i>
            <i className="floating-icon fas fa-users" style={{ bottom: '10%', right: '5%' }}></i>

            <div className="text-center max-w-5xl relative z-10">
                <div className="fade-item inline-flex items-center gap-3 bg-white/20 backdrop-blur px-5 py-2 rounded-full mb-8">
                    <span className="w-2 h-2 bg-green-400 rounded-full pulse"></span>
                    <span className="text-white text-sm font-medium">Digital Transformation for Local Governance</span>
                </div>

                <h1 className="fade-item text-6xl md:text-8xl font-black text-white mb-6 leading-tight">
                    Barangay<br /><span className="text-cyan-300">Connect</span>
                </h1>

                <p className="fade-item text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                    Eliminating long queues through smart scheduling via
                    <strong> Facebook Messenger</strong> & <strong>SMS Hotline</strong>
                </p>

                <div className="fade-item flex flex-wrap justify-center gap-6 mb-12">
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
                        <div className="icon-circle bg-blue-500 flex items-center justify-center w-12 h-12 rounded-full shadow-lg shadow-blue-500/30">
                            <i className="fab fa-facebook-messenger text-white text-xl"></i>
                        </div>
                        <div className="text-left">
                            <div className="text-white font-bold">Messenger</div>
                            <div className="text-blue-200 text-sm">Chatbot</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
                        <div className="icon-circle bg-green-500 flex items-center justify-center w-12 h-12 rounded-full shadow-lg shadow-green-500/30">
                            <i className="fas fa-sms text-white text-xl"></i>
                        </div>
                        <div className="text-left">
                            <div className="text-white font-bold">SMS</div>
                            <div className="text-green-200 text-sm">Hotline</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
                        <div className="icon-circle bg-amber-500 flex items-center justify-center w-12 h-12 rounded-full shadow-lg shadow-amber-500/30">
                            <i className="fas fa-bell text-white text-xl"></i>
                        </div>
                        <div className="text-left">
                            <div className="text-white font-bold">Smart</div>
                            <div className="text-amber-200 text-sm">Alerts</div>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={onExplore}
                    size="lg"
                    className="fade-item bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800 text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold"
                >
                    Explore Documentation <i className="fas fa-arrow-right ml-2"></i>
                </Button>
            </div>
        </section>
    );
};
