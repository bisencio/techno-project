import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TechnicalProps {
    isActive: boolean;
}

export const Technical: React.FC<TechnicalProps> = ({ isActive }) => {
    return (
        <section className={`section-panel bg-gradient-5 ${isActive ? 'active' : ''}`} id="section-4">
            <div className="bg-pattern"></div>

            <div className="w-full max-w-5xl relative z-10">
                <h2 className="fade-item text-4xl font-bold text-white text-center mb-10">
                    Technical Requirements
                </h2>

                <div className="flex flex-col gap-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <TechCard
                            icon="fas fa-database"
                            bg="bg-gradient-to-br from-blue-500 to-blue-700"
                            title="Database"
                            items={[
                                "PostgreSQL 15",
                                "Managed Cloud Instance",
                                "Auto-scaling Storage"
                            ]}
                        />
                        <TechCard
                            icon="fas fa-server"
                            bg="bg-gradient-to-br from-green-500 to-green-700"
                            title="Hosting"
                            items={[
                                "DigitalOcean Droplet",
                                "Ubuntu 22.04 LTS",
                                "Nginx Reverse Proxy"
                            ]}
                        />
                        <TechCard
                            icon="fas fa-sms"
                            bg="bg-gradient-to-br from-purple-500 to-purple-700"
                            title="SMS Gateway"
                            items={[
                                "Semaphore API",
                                "RESTful Integration",
                                "Sender ID Masking"
                            ]}
                        />
                    </div>

                    <div className="fade-item">
                        <h3 className="text-lg font-semibold text-white/80 text-center mb-4">
                            Tech Stack
                        </h3>
                        <div className="flex justify-center">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl w-full">
                                <StackItem
                                    icon="fab fa-node-js"
                                    color="text-green-400"
                                    title="Node.js"
                                    subtitle="Runtime"
                                />
                                <StackItem
                                    icon="fab fa-facebook-messenger"
                                    color="text-blue-400"
                                    title="Messenger API"
                                    subtitle="Chat Platform"
                                />
                                <StackItem
                                    icon="fab fa-react"
                                    color="text-cyan-400"
                                    title="React.js"
                                    subtitle="Dashboard"
                                />
                                <StackItem
                                    icon="fas fa-robot"
                                    color="text-purple-400"
                                    title="Dialogflow"
                                    subtitle="NLP Engine"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

interface TechCardProps {
    icon: string;
    bg: string;
    title: string;
    items: string[];
}

const TechCard: React.FC<TechCardProps> = ({ icon, bg, title, items }) => (
    <Card className="fade-item bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full">
        <CardContent className="p-8 h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6">
                <div className={`${bg} flex items-center justify-center w-14 h-14 rounded-full shadow-lg flex-shrink-0`}>
                    <i className={`${icon} text-white text-xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-white">
                    {title}
                </h3>
            </div>
            <ul className="space-y-2 flex-grow ml-2">
                {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                        <i className="fas fa-check text-green-400 text-xs mt-0.5 flex-shrink-0 w-3"></i>
                        <span className="text-blue-100/90 text-xs leading-relaxed">{item}</span>
                    </li>
                ))}
            </ul>
        </CardContent>
    </Card>
);

interface StackItemProps {
    icon: string;
    color: string;
    title: string;
    subtitle: string;
}

const StackItem: React.FC<StackItemProps> = ({ icon, color, title, subtitle }) => (
    <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-5 text-center hover:bg-white/15 transition-all duration-300">
        <i className={`${icon} ${color} text-4xl mb-3 block`}></i>
        <div className="text-white font-medium text-sm">{title}</div>
        <div className="text-white/50 text-xs mt-1">{subtitle}</div>
    </div>
);

export default Technical;