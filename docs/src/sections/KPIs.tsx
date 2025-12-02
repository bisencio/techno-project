import React, { useEffect, useState } from 'react';

interface KPIsProps {
    isActive: boolean;
}

export const KPIs: React.FC<KPIsProps> = ({ isActive }) => {
    const [adoptionRate, setAdoptionRate] = useState(0);
    const [noShowRate, setNoShowRate] = useState(0);
    const [waitTime, setWaitTime] = useState(0);
    const [satisfaction, setSatisfaction] = useState(0);

    const [todayBookings, setTodayBookings] = useState(0);
    const [currentQueue, setCurrentQueue] = useState(0);
    const [completedToday, setCompletedToday] = useState(0);

    const animateValue = (
        start: number,
        end: number,
        duration: number,
        setter: React.Dispatch<React.SetStateAction<number>>
    ) => {
        const range = end - start;
        const startTime = performance.now();

        const update = (time: number) => {
            const progress = Math.min((time - startTime) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 4);
            const value = start + range * easeOut;
            setter(value);
            if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };

    const animateKPIs = () => {
        animateValue(0, 32, 1500, setAdoptionRate);
        animateValue(0, 12, 1500, setNoShowRate);
        animateValue(0, 12, 1500, setWaitTime);
        animateValue(0, 4.6, 1500, setSatisfaction);

        animateValue(0, 47, 1500, setTodayBookings);
        animateValue(0, 8, 1500, setCurrentQueue);
        animateValue(0, 39, 1500, setCompletedToday);
    };

    useEffect(() => {
        if (isActive) {
            setTimeout(animateKPIs, 600);
        } else {
            // Reset values when not active
            setAdoptionRate(0);
            setNoShowRate(0);
            setWaitTime(0);
            setSatisfaction(0);
            setTodayBookings(0);
            setCurrentQueue(0);
            setCompletedToday(0);
        }
    }, [isActive]);

    return (
        <section className={`section-panel bg-gradient-6 ${isActive ? 'active' : ''}`} id="section-5">
            <div className="bg-pattern"></div>

            <div className="w-full max-w-7xl relative z-10">
                <h2 className="fade-item text-4xl font-bold text-white text-center mb-8">
                    <i className="fas fa-chart-line text-cyan-300 mr-3"></i>Key Performance Indicators
                </h2>

                <div className="grid grid-cols-4 gap-6 mb-8">
                    <KPICard
                        value={Math.floor(adoptionRate)}
                        suffix="%"
                        label="Adoption Rate"
                        subLabel="Target: 40% in 6mo"
                        color="cyan"
                        width={isActive ? '80%' : '0%'}
                    />
                    <KPICard
                        value={Math.floor(noShowRate)}
                        suffix="%"
                        label="No-Show Rate"
                        subLabel="Target: Below 15%"
                        color="green"
                        width={isActive ? '80%' : '0%'}
                    />
                    <KPICard
                        value={Math.floor(waitTime)}
                        suffix=""
                        label="Avg Wait (min)"
                        subLabel="Target: Under 15"
                        color="amber"
                        width={isActive ? '80%' : '0%'}
                    />
                    <KPICard
                        value={satisfaction.toFixed(1)}
                        suffix=""
                        label="Satisfaction"
                        subLabel="Target: 4.5+ stars"
                        color="purple"
                        width={isActive ? '92%' : '0%'}
                    />
                </div>

                {/* Live Dashboard */}
                <div className="fade-item info-card">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-green-400 rounded-full pulse"></span>
                            <span className="text-white font-medium">Live Dashboard Preview</span>
                        </div>
                        <button
                            onClick={animateKPIs}
                            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm transition cursor-pointer"
                        >
                            <i className="fas fa-sync-alt mr-2"></i>Refresh
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <DashboardStat value={Math.floor(todayBookings)} label="Today's Bookings" />
                        <DashboardStat value={Math.floor(currentQueue)} label="In Queue Now" />
                        <DashboardStat value={Math.floor(completedToday)} label="Completed Today" />
                    </div>
                </div>

                {/* Footer */}
                <div className="fade-item mt-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <i className="fas fa-calendar-check text-white text-xl"></i>
                        <span className="text-white font-bold text-lg">Barangay Connect Scheduler</span>
                    </div>
                    <p className="text-cyan-200 text-sm">Transforming local governance for every Filipino</p>
                </div>
            </div>
        </section>
    );
};

const KPICard: React.FC<{
    value: number | string;
    suffix: string;
    label: string;
    subLabel: string;
    color: string;
    width: string;
}> = ({ value, suffix, label, subLabel, color, width }) => {
    const colorClasses: Record<string, string> = {
        cyan: 'text-cyan-300 bg-cyan-400',
        green: 'text-green-300 bg-green-400',
        amber: 'text-amber-300 bg-amber-400',
        purple: 'text-purple-300 bg-purple-400',
    };

    const [textColor, bgColor] = colorClasses[color].split(' ');

    return (
        <div className="fade-item info-card text-center">
            <div className="stat-number">{value}{suffix}</div>
            <div className={`${textColor} font-medium mt-2`}>{label}</div>
            <div className="text-gray-400 text-xs mt-1">{subLabel}</div>
            <div className="mt-3 bg-white/10 rounded-full h-2">
                <div className={`${bgColor} rounded-full h-2 transition-all duration-1000`} style={{ width }}></div>
            </div>
        </div>
    );
};

const DashboardStat: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="bg-white/5 rounded-xl p-4 text-center">
        <div className="text-3xl font-bold text-white">{value}</div>
        <div className="text-gray-400 text-sm">{label}</div>
    </div>
);
