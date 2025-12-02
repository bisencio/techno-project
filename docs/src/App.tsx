import React, { useState, useEffect, useCallback } from 'react';
import { Hero } from './sections/Hero';
import { Overview } from './sections/Overview';
import { UserFlow } from './sections/UserFlow';
import { ScriptsDemo } from './sections/ScriptsDemo';
import { Technical } from './sections/Technical';
import { KPIs } from './sections/KPIs';

function App() {
    const [currentSection, setCurrentSection] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const totalSections = 6;

    const goToSection = useCallback((index: number) => {
        if (index < 0 || index >= totalSections || isTransitioning || index === currentSection) return;

        setIsTransitioning(true);
        setCurrentSection(index);

        setTimeout(() => { setIsTransitioning(false); }, 800);
    }, [currentSection, isTransitioning, totalSections]);

    useEffect(() => {
        let lastWheel = 0;

        const handleWheel = (e: WheelEvent) => {
            const now = Date.now();
            if (now - lastWheel < 1000) return;
            lastWheel = now;

            if (e.deltaY > 0) goToSection(currentSection + 1);
            else goToSection(currentSection - 1);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToSection(currentSection + 1);
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goToSection(currentSection - 1);
        };

        let touchStartY = 0;
        const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
        const handleTouchEnd = (e: TouchEvent) => {
            const diff = touchStartY - e.changedTouches[0].clientY;
            if (Math.abs(diff) > 50) {
                if (diff > 0) goToSection(currentSection + 1);
                else goToSection(currentSection - 1);
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: true });
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('wheel', handleWheel);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [currentSection, goToSection]);

    const progress = ((currentSection + 1) / totalSections) * 100;

    return (
        <>
            {/* Progress Bar */}
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>

            {/* Navigation Dots */}
            <div className="nav-dots">
                {['Home', 'Overview', 'User Flow', 'Scripts', 'Technical', 'KPIs'].map((label, index) => (
                    <div
                        key={index}
                        className={`nav-dot ${index === currentSection ? 'active' : ''}`}
                        onClick={() => goToSection(index)}
                    >
                        <span className="nav-dot-label">{label}</span>
                    </div>
                ))}
            </div>

            {/* Section Counter */}
            <div className="section-counter">
                <button
                    onClick={() => goToSection(currentSection - 1)}
                    disabled={currentSection === 0}
                >
                    <i className="fas fa-chevron-left"></i>
                </button>
                <span><span>{currentSection + 1}</span> / {totalSections}</span>
                <button
                    onClick={() => goToSection(currentSection + 1)}
                    disabled={currentSection === totalSections - 1}
                >
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>

            <Hero isActive={currentSection === 0} onExplore={() => goToSection(1)} />
            <Overview isActive={currentSection === 1} />
            <UserFlow isActive={currentSection === 2} />
            <ScriptsDemo isActive={currentSection === 3} />
            <Technical isActive={currentSection === 4} />
            <KPIs isActive={currentSection === 5} />
        </>
    );
}

export default App;
