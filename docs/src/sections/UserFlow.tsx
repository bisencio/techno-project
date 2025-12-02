import React, { useState, useEffect } from 'react';

interface UserFlowProps {
    isActive: boolean;
}

const messengerSteps = [
    { icon: "fas fa-comment-dots", bg: "bg-blue-500", title: "Start Chat", description: "Open Messenger chatbot" },
    { icon: "fas fa-user-plus", bg: "bg-green-500", title: "Register", description: "Name + Mobile number" },
    { icon: "fas fa-list", bg: "bg-purple-500", title: "Select Service", description: "Choose from services" },
    { icon: "fas fa-calendar", bg: "bg-orange-500", title: "Pick Slot", description: "Select date & time" },
    { icon: "fas fa-check-circle", bg: "bg-cyan-500", title: "Confirm", description: "Get reference number" },
    { icon: "fas fa-bell", bg: "bg-amber-500", title: "Get Alert", description: "Queue notification" },
    { icon: "fas fa-star", bg: "bg-emerald-500", title: "Complete", description: "Rate your experience" },
];

const smsSteps = [
    { icon: "fas fa-mobile-alt", bg: "bg-gray-600", title: "Send BOOK", description: "Text to hotline" },
    { icon: "fas fa-list-ol", bg: "bg-gray-500", title: "Get Menu", description: "Receive options" },
    { icon: "fas fa-reply", bg: "bg-green-600", title: "Reply", description: "Send selection" },
    { icon: "fas fa-calendar-alt", bg: "bg-blue-600", title: "Pick Slot", description: "Choose time slot" },
    { icon: "fas fa-check", bg: "bg-cyan-600", title: "Confirmed", description: "Get REF# via SMS" },
    { icon: "fas fa-comment-sms", bg: "bg-amber-600", title: "Alert SMS", description: "Queue notice" },
    { icon: "fas fa-thumbs-up", bg: "bg-emerald-600", title: "Done", description: "Send feedback" },
];

export const UserFlow: React.FC<UserFlowProps> = ({ isActive }) => {
    const [activeTab, setActiveTab] = useState<'messenger' | 'sms'>('messenger');
    const [activeStep, setActiveStep] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const currentSteps = activeTab === 'messenger' ? messengerSteps : smsSteps;

    useEffect(() => {
        if (!isActive || !isAutoPlaying) return;
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % currentSteps.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [isActive, isAutoPlaying, currentSteps.length]);

    useEffect(() => {
        setActiveStep(0);
    }, [activeTab]);

    const handleStepClick = (index: number) => {
        setActiveStep(index);
        setIsAutoPlaying(false);
    };

    // Calculate progress percentage based on step position
    const progressWidth = (activeStep / (currentSteps.length - 1)) * 100;

    return (
        <section className={`section-panel bg-gradient-3 ${isActive ? 'active' : ''}`} id="section-2">
            <div className="bg-pattern"></div>
            <div className="w-full max-w-7xl relative z-10 flex flex-col justify-between h-full py-6 md:py-8 px-4 md:px-16">
                
                {/* Header */}
                <div className="fade-item text-center mb-6">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 tracking-tight">
                        <i className="fas fa-project-diagram text-emerald-300 mr-3"></i>
                        User Journey Flow
                    </h2>
                    
                    {/* Toggle Buttons */}
                    <div className="inline-flex items-center bg-black/40 backdrop-blur-md rounded-full p-2 border border-white/10 shadow-xl gap-3">
                        <button
                            onClick={() => setActiveTab('messenger')}
                            className={`
                                relative rounded-full px-10 py-3.5 text-base font-bold transition-all duration-300 whitespace-nowrap flex items-center gap-3
                                ${activeTab === 'messenger'
                                    ? 'bg-white text-emerald-900 shadow-lg scale-105'
                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                                }
                            `}
                        >
                            <i className="fab fa-facebook-messenger text-xl"></i>
                            <span>Messenger</span>
                        </button>
                        
                        <button
                            onClick={() => setActiveTab('sms')}
                            className={`
                                relative rounded-full px-10 py-3.5 text-base font-bold transition-all duration-300 whitespace-nowrap flex items-center gap-3
                                ${activeTab === 'sms'
                                    ? 'bg-white text-emerald-900 shadow-lg scale-105'
                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                                }
                            `}
                        >
                            <i className="fas fa-sms text-xl"></i>
                            <span>SMS</span>
                        </button>
                    </div>
                </div>

                {/* Steps Timeline - Fixed Alignment */}
                <div className="fade-item w-full my-8 max-w-4xl mx-auto px-4">
                    <div className="relative">
                        {/* Steps Row */}
                        <div className="flex justify-between items-center relative">
                            
                            {/* Background Track - Positioned to center of icons */}
                            <div 
                                className="absolute h-1 bg-white/20 rounded-full z-0"
                                style={{
                                    top: '50%',
                                    left: '28px',
                                    right: '28px',
                                    transform: 'translateY(-50%)'
                                }}
                            />
                            
                            {/* Progress Track */}
                            <div
                                className="absolute h-1 bg-gradient-to-r from-emerald-400 to-cyan-300 rounded-full transition-all duration-700 ease-out z-0 shadow-[0_0_15px_rgba(52,211,153,0.6)]"
                                style={{ 
                                    top: '50%',
                                    left: '28px',
                                    width: `calc(${progressWidth}% - ${progressWidth * 0.56 / (currentSteps.length - 1)}px)`,
                                    transform: 'translateY(-50%)'
                                }}
                            />
                            
                            {/* Step Icons */}
                            {currentSteps.map((step, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center cursor-pointer relative z-10"
                                    onClick={() => handleStepClick(index)}
                                >
                                    {/* Icon Circle */}
                                    <div
                                        className={`
                                            w-14 h-14 rounded-full flex items-center justify-center
                                            transition-all duration-500 ease-out border-2 
                                            ${index <= activeStep
                                                ? `${step.bg} border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.3)]`
                                                : 'bg-slate-700/90 border-white/20 text-white/40'
                                            }
                                            ${index === activeStep 
                                                ? 'scale-110 ring-4 ring-white/20' 
                                                : 'hover:scale-105 hover:border-white/40'
                                            }
                                        `}
                                    >
                                        <i className={`${step.icon} text-xl`}></i>
                                    </div>
                                    
                                    {/* Step Title - Below icons */}
                                    <span className={`
                                        mt-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap
                                        transition-all duration-300
                                        ${index === activeStep ? 'text-white opacity-100' : 'text-white/50 opacity-70'}
                                    `}>
                                        {step.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Active Step Card */}
                <div className="fade-item w-full flex justify-center mb-8">
                    <div className="relative w-full max-w-xl">
                        <div className="absolute inset-0 bg-emerald-500/30 blur-3xl rounded-full opacity-50"></div>
                        
                        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 flex items-center gap-6 shadow-2xl">
                            <div className={`w-18 h-18 ${currentSteps[activeStep].bg} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 transition-all duration-500`}
                                style={{ width: '72px', height: '72px' }}
                            >
                                <i className={`${currentSteps[activeStep].icon} text-white text-3xl`}></i>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-emerald-300 text-sm font-bold tracking-wider uppercase">
                                        Step {activeStep + 1} of {currentSteps.length}
                                    </span>
                                    {isAutoPlaying && (
                                        <span className="flex h-2.5 w-2.5 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-white font-bold text-2xl leading-tight mb-1">{currentSteps[activeStep].title}</h3>
                                <p className="text-white/70 text-sm">{currentSteps[activeStep].description}</p>
                            </div>
                            
                            <div className="border-l border-white/20 pl-5">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsAutoPlaying(!isAutoPlaying); }}
                                    className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-all duration-300 text-white/80 hover:text-white hover:scale-110"
                                >
                                    <i className={`fas ${isAutoPlaying ? 'fa-pause' : 'fa-play'} text-sm`}></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Available Services */}
                <div className="fade-item">
                    <div className="flex items-center justify-center gap-4 mb-5">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/30"></div>
                        <span className="text-white/60 text-sm uppercase tracking-[0.2em] font-semibold">Available Services</span>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/30"></div>
                    </div>
                    <div className="flex justify-center flex-wrap gap-4">
                        {[
                            { icon: "fas fa-file-contract", title: "Clearance" },
                            { icon: "fas fa-id-card", title: "Barangay ID" },
                            { icon: "fas fa-heartbeat", title: "Health" },
                            { icon: "fas fa-hand-holding-heart", title: "Indigency" },
                            { icon: "fas fa-ellipsis-h", title: "Others" },
                        ].map((service, index) => (
                            <div
                                key={index}
                                className="group bg-black/20 hover:bg-emerald-500/20 backdrop-blur-sm border border-white/10 hover:border-emerald-500/30 rounded-xl px-6 py-3 flex items-center gap-3 transition-all duration-300 cursor-default hover:-translate-y-1"
                            >
                                <i className={`${service.icon} text-white/70 group-hover:text-emerald-300 text-xl transition-colors`}></i>
                                <span className="text-white/90 group-hover:text-white text-base font-medium transition-colors">{service.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UserFlow;