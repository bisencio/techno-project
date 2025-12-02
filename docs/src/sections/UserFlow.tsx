import React, { useState } from 'react';

interface UserFlowProps {
    isActive: boolean;
}

export const UserFlow: React.FC<UserFlowProps> = ({ isActive }) => {
    const [activeTab, setActiveTab] = useState<'messenger' | 'sms'>('messenger');

    return (
        <section className={`section-panel bg-gradient-3 ${isActive ? 'active' : ''}`} id="section-2">
            <div className="bg-pattern"></div>

            <div className="w-full max-w-7xl relative z-10">
                <h2 className="fade-item text-4xl font-bold text-white text-center mb-8">
                    <i className="fas fa-project-diagram text-emerald-300 mr-3"></i>User Journey Flow
                </h2>

                {/* Platform Toggle */}
                <div className="fade-item flex justify-center mb-8">
                    <div className="bg-black/30 backdrop-blur rounded-full p-1 inline-flex">
                        <button
                            onClick={() => setActiveTab('messenger')}
                            className={`px-6 py-2 rounded-full font-medium transition cursor-pointer ${activeTab === 'messenger'
                                ? 'text-white bg-white/20'
                                : 'text-white/60 hover:text-white'
                                }`}
                        >
                            <i className="fab fa-facebook-messenger mr-2"></i>Messenger
                        </button>
                        <button
                            onClick={() => setActiveTab('sms')}
                            className={`px-6 py-2 rounded-full font-medium transition cursor-pointer ${activeTab === 'sms'
                                ? 'text-white bg-white/20'
                                : 'text-white/60 hover:text-white'
                                }`}
                        >
                            <i className="fas fa-sms mr-2"></i>SMS
                        </button>
                    </div>
                </div>

                {/* Messenger Flow */}
                <div className={`fade-item ${activeTab === 'messenger' ? '' : 'hidden'}`}>
                    <div className="flex items-center justify-between gap-4">
                        <FlowStep icon="fas fa-comment-dots" bg="bg-blue-500" title="Start Chat" subtitle="Open Messenger" />
                        <FlowStep icon="fas fa-user-plus" bg="bg-green-500" title="Register" subtitle="Name + Mobile" />
                        <FlowStep icon="fas fa-list" bg="bg-purple-500" title="Select Service" subtitle="Quick Buttons" />
                        <FlowStep icon="fas fa-calendar" bg="bg-orange-500" title="Pick Slot" subtitle="Date & Time" />
                        <FlowStep icon="fas fa-check-circle" bg="bg-cyan-500" title="Confirm" subtitle="Get REF#" />
                        <FlowStep icon="fas fa-bell" bg="bg-amber-500" title="Get Alert" subtitle="3-5 Away" />
                        <FlowStep icon="fas fa-star" bg="bg-emerald-500" title="Complete" subtitle="Rate Service" isLast />
                    </div>
                </div>

                {/* SMS Flow */}
                <div className={`fade-item ${activeTab === 'sms' ? '' : 'hidden'}`}>
                    <div className="flex items-center justify-between gap-4">
                        <FlowStep icon="fas fa-mobile-alt" bg="bg-gray-600" title="Send BOOK" subtitle="To Hotline" />
                        <FlowStep icon="fas fa-list-ol" bg="bg-gray-500" title="Get Menu" subtitle="1-5 Options" />
                        <FlowStep icon="fas fa-reply" bg="bg-green-600" title="Reply" subtitle="[#] [Name]" />
                        <FlowStep icon="fas fa-calendar-alt" bg="bg-blue-600" title="Pick Slot" subtitle="A/B/C Code" />
                        <FlowStep icon="fas fa-check" bg="bg-cyan-600" title="Confirmed" subtitle="REF# via SMS" />
                        <FlowStep icon="fas fa-comment-sms" bg="bg-amber-600" title="Alert SMS" subtitle="Queue Notice" />
                        <FlowStep icon="fas fa-thumbs-up" bg="bg-emerald-600" title="Done" subtitle="Feedback" isLast />
                    </div>
                </div>

                {/* Services Available */}
                <div className="fade-item grid grid-cols-5 gap-4 mt-10">
                    <ServiceCard icon="fas fa-file-contract" title="Barangay Clearance" />
                    <ServiceCard icon="fas fa-id-card" title="Barangay ID" />
                    <ServiceCard icon="fas fa-heartbeat" title="Health Center" />
                    <ServiceCard icon="fas fa-hand-holding-heart" title="Certificate of Indigency" />
                    <ServiceCard icon="fas fa-ellipsis-h" title="Other Services" />
                </div>
            </div>
        </section>
    );
};

const FlowStep: React.FC<{ icon: string; bg: string; title: string; subtitle: string; isLast?: boolean }> = ({
    icon, bg, title, subtitle
}) => (
    <div className="flow-step flex-1">
        <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg`}>
            <i className={`${icon} text-white text-xl`}></i>
        </div>
        <div className="text-white font-bold text-sm">{title}</div>
        <div className="text-emerald-200 text-xs">{subtitle}</div>
    </div>
);

const ServiceCard: React.FC<{ icon: string; title: string }> = ({ icon, title }) => (
    <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
        <i className={`${icon} text-3xl text-white mb-2`}></i>
        <div className="text-white text-sm font-medium">{title}</div>
    </div>
);
