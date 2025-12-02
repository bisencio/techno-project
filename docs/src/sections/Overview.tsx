import React from 'react';

interface OverviewProps {
    isActive: boolean;
}

export const Overview: React.FC<OverviewProps> = ({ isActive }) => {
    return (
        <section className={`section-panel bg-gradient-2 ${isActive ? 'active' : ''}`} id="section-1">
            <div className="bg-pattern"></div>

            <div className="w-full max-w-7xl relative z-10">
                <h2 className="fade-item text-4xl font-bold text-white text-center mb-10">
                    <i className="fas fa-bullseye text-cyan-400 mr-3"></i>Project Overview
                </h2>

                <div className="grid grid-cols-3 gap-6 mb-10">
                    {/* Vision */}
                    <div className="fade-item info-card">
                        <div className="icon-circle bg-gradient-to-br from-blue-500 to-cyan-500 mb-4">
                            <i className="fas fa-eye text-white"></i>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Vision</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Build a future where every Filipino avoids long queues, positioning barangays as models of efficient governance.
                        </p>
                    </div>

                    {/* Mission */}
                    <div className="fade-item info-card">
                        <div className="icon-circle bg-gradient-to-br from-green-500 to-emerald-500 mb-4">
                            <i className="fas fa-rocket text-white"></i>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Mission</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Use Messenger & SMS to provide easy, transparent appointment booking that cuts waiting time.
                        </p>
                    </div>

                    {/* Goal */}
                    <div className="fade-item info-card">
                        <div className="icon-circle bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
                            <i className="fas fa-flag-checkered text-white"></i>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Goal</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Centralized booking system accessible via popular platforms, practical and cost-efficient.
                        </p>
                    </div>
                </div>

                {/* Problems & Users */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="fade-item info-card">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <i className="fas fa-exclamation-triangle text-red-400"></i> Problems We Solve
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <i className="fas fa-users text-red-400 text-2xl"></i>
                                </div>
                                <p className="text-white text-xs font-medium">Long Queues</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <i className="fas fa-clock text-orange-400 text-2xl"></i>
                                </div>
                                <p className="text-white text-xs font-medium">Wasted Time</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <i className="fas fa-file-alt text-yellow-400 text-2xl"></i>
                                </div>
                                <p className="text-white text-xs font-medium">Manual Process</p>
                            </div>
                        </div>
                    </div>

                    <div className="fade-item info-card">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <i className="fas fa-user-friends text-cyan-400"></i> Target Users
                        </h3>
                        <div className="grid grid-cols-4 gap-3">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <i className="fas fa-briefcase text-blue-400"></i>
                                </div>
                                <p className="text-white text-xs">Workers</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <i className="fas fa-user-tie text-green-400"></i>
                                </div>
                                <p className="text-white text-xs">Seniors</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <i className="fas fa-home text-purple-400"></i>
                                </div>
                                <p className="text-white text-xs">Parents</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <i className="fas fa-graduation-cap text-pink-400"></i>
                                </div>
                                <p className="text-white text-xs">Students</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
