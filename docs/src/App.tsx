import React, { useState, useEffect, useCallback } from 'react';
import { initializeSections, Section } from './sections';

function App() {
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentSection, setCurrentSection] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const loadSections = async () => {
            try {
                const loadedSections = await initializeSections();
                setSections(loadedSections);
            } catch (error) {
                console.error('Error loading sections:', error);
                setSections([]);
            } finally {
                setLoading(false);
            }
        };
        loadSections();
    }, []);

    const totalSections = sections.length;

    const goToSection = useCallback((index: number) => {
        if (index < 0 || index >= totalSections || isTransitioning || index === currentSection) return;

        setIsTransitioning(true);
        setCurrentSection(index);

        setTimeout(() => { setIsTransitioning(false); }, 800);
    }, [currentSection, isTransitioning, totalSections]);

    useEffect(() => {
        if (totalSections === 0) return; // Don't set up navigation if no sections

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
    }, [currentSection, goToSection, totalSections]);

    // Show loading state
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontSize: '1.5rem'
            }}>
                Loading sections...
            </div>
        );
    }

    // Handle case where no sections loaded
    if (totalSections === 0) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                textAlign: 'center',
                padding: '2rem'
            }}>
                <div>
                    <h1>No sections available</h1>
                    <p>Please add section files to the sections folder.</p>
                </div>
            </div>
        );
    }

    const progress = ((currentSection + 1) / totalSections) * 100;

    return (
        <>
            {/* Progress Bar */}
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>

            {/* Navigation Dots */}
            <div className="nav-dots">
                {sections.map((section, index) => (
                    <div
                        key={section.id}
                        className={`nav-dot ${index === currentSection ? 'active' : ''}`}
                        onClick={() => goToSection(index)}
                    >
                        <span className="nav-dot-label">{section.label}</span>
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

            {/* Render sections dynamically */}
            {sections.map((section, index) => {
                const { Component } = section;
                const isActive = index === currentSection;

                // Special handling for Hero section which needs onExplore prop
                const props = section.id === 'hero'
                    ? { isActive, onExplore: () => goToSection(1) }
                    : { isActive };

                return <Component key={section.id} {...props} />;
            })}
        </>
    );
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center h-screen bg-gray-900 text-white p-4 text-center">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">Something went wrong.</h1>
                        <p className="text-gray-400 mb-4">Please refresh the page or try again later.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

const AppWithBoundary = () => (
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);

export default AppWithBoundary;
