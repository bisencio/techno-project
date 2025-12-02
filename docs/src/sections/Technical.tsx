import React from 'react';

interface TechnicalProps {
    isActive: boolean;
}

export const Technical: React.FC<TechnicalProps> = ({ isActive }) => {
    return (
        <section className={`section-panel bg-gradient-5 ${isActive ? 'active' : ''}`} id="section-4">
            <div className="bg-pattern"></div>

            <div className="w-full max-w-7xl relative z-10">
                <h2 className="fade-item text-4xl font-bold text-white text-center mb-8">
                    <i className="fas fa-cogs text-cyan-400 mr-3"></i>Technical Requirements
                </h2>

                <div className="grid grid-cols-3 gap-6 mb-8">
                    <TechCard
                        icon="fas fa-database"
                        bg="bg-gradient-to-br from-blue-500 to-blue-700"
                        title="Database"
                        items={["PostgreSQL/MySQL", "User & Appointment Tables", "5GB Storage"]}
                    />
                    <TechCard
                        icon="fas fa-server"
                        bg="bg-gradient-to-br from-green-500 to-green-700"
                        title="Hosting"
                        items={["DigitalOcean/Railway", "1GB RAM, 1 vCPU", "SSL Certificate"]}
                    />
                    <TechCard
                        icon="fas fa-sms"
                        bg="bg-gradient-to-br from-purple-500 to-purple-700"
                        title="SMS Gateway"
                        items={["Semaphore API", "₱0.35-0.50/SMS", "Two-way Support"]}
                    />
                </div>

                {/* Cost Breakdown */}
                <div className="fade-item grid grid-cols-2 gap-6">
                    <div className="info-card">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <i className="fas fa-code text-cyan-400"></i> Tech Stack
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <StackItem icon="fab fa-node-js" color="text-green-400" title="Node.js" />
                            <StackItem icon="fab fa-facebook" color="text-blue-400" title="Graph API" />
                            <StackItem icon="fab fa-react" color="text-cyan-400" title="React Admin" />
                            <StackItem icon="fas fa-robot" color="text-purple-400" title="Dialogflow" />
                        </div>
                    </div>

                    <div className="fade-item info-card">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <i className="fas fa-peso-sign text-green-400"></i> Monthly Cost
                        </h3>
                        <div className="space-y-2">
                            <CostItem label="Cloud Hosting" cost="₱300-600" />
                            <CostItem label="SMS (500 msgs)" cost="₱175-250" />
                            <CostItem label="Messenger API" cost="FREE" isFree />
                            <CostItem label="Domain (.ph)" cost="₱100-200" />
                            <div className="border-t border-white/20 my-2 pt-2 flex justify-between">
                                <span className="text-white font-bold">TOTAL</span>
                                <span className="text-cyan-400 font-bold font-mono">₱575 - ₱1,050</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const TechCard: React.FC<{ icon: string; bg: string; title: string; items: string[] }> = ({ icon, bg, title, items }) => (
    <div className="fade-item info-card text-center">
        <div className={`icon-circle ${bg} mx-auto mb-4`}>
            <i className={`${icon} text-white`}></i>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <div className="text-gray-400 text-sm space-y-1">
            {items.map((item, i) => (
                <div key={i}><i className="fas fa-check text-green-400 mr-2"></i>{item}</div>
            ))}
        </div>
    </div>
);

const StackItem: React.FC<{ icon: string; color: string; title: string }> = ({ icon, color, title }) => (
    <div className="bg-white/5 rounded-lg p-3 text-center">
        <i className={`${icon} ${color} text-2xl mb-1`}></i>
        <div className="text-white text-xs">{title}</div>
    </div>
);

const CostItem: React.FC<{ label: string; cost: string; isFree?: boolean }> = ({ label, cost, isFree }) => (
    <div className="flex justify-between text-sm">
        <span className="text-gray-400">{label}</span>
        <span className={`${isFree ? 'text-green-400' : 'text-white'} font-mono`}>{cost}</span>
    </div>
);
