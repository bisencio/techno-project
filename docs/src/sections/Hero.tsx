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

            <div className="hero-content">
                <div className="fade-item hero-badge">
                    <span className="w-2 h-2 bg-green-400 rounded-full pulse"></span>
                    <span>Digital Transformation for Local Governance</span>
                </div>

                <h1 className="fade-item hero-title">
                    Barangay<br /><span>Connect</span>
                </h1>

                <p className="fade-item hero-subtitle">
                    Eliminating long queues through smart scheduling via
                    <strong> Facebook Messenger</strong> & <strong>SMS Hotline</strong>
                </p>

                <div className="fade-item hero-feature-grid">
                    <div className="hero-feature-card">
                        <div className="icon-circle bg-blue-500">
                            <i className="fab fa-facebook-messenger text-white text-xl"></i>
                        </div>
                        <div>
                            <div className="text-white font-bold">Messenger</div>
                            <div className="text-blue-200 text-sm">Chatbot</div>
                        </div>
                    </div>
                    <div className="hero-feature-card">
                        <div className="icon-circle bg-green-500">
                            <i className="fas fa-sms text-white text-xl"></i>
                        </div>
                        <div>
                            <div className="text-white font-bold">SMS</div>
                            <div className="text-green-200 text-sm">Hotline</div>
                        </div>
                    </div>
                    <div className="hero-feature-card">
                        <div className="icon-circle bg-amber-500">
                            <i className="fas fa-bell text-white text-xl"></i>
                        </div>
                        <div>
                            <div className="text-white font-bold">Smart</div>
                            <div className="text-amber-200 text-sm">Alerts</div>
                        </div>
                    </div>
                </div>

                <div className="fade-item hero-cta-row">
<Button
    onClick={onExplore}
    className="bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800 px-7 py-3 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold text-base"
>
    Explore Documentation <i className="fas fa-arrow-right ml-2"></i>
</Button>
                </div>
            </div>
        </section>
    );
};