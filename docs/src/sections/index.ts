import React from 'react';
export interface Section {
    id: string;
    label: string;
    Component: React.ComponentType<any>;
}

const loadSection = async (
    id: string,
    label: string,
    importFn: () => Promise<any>
): Promise<Section | null> => {
    try {
        const module = await importFn();
        const componentName = Object.keys(module).find(key => key !== 'default');
        const Component = componentName ? module[componentName] : module.default;

        if (Component) {
            return { id, label, Component };
        }
    } catch (error) {
        console.warn(`Section "${label}" could not be loaded:`, error);
    }
    return null;
};

export const initializeSections = async (): Promise<Section[]> => {
    const sectionPromises = [
        loadSection('hero', 'Home', () => import('./Hero')),
        // loadSection('overview', 'Overview', () => import('./Overview.tsx.example')),
        loadSection('userflow', 'User Flow', () => import('./UserFlow')),
        loadSection('scripts', 'Scripts', () => import('./ScriptsDemo')),
        loadSection('technical', 'Technical', () => import('./Technical')),
    ];

    const results = await Promise.all(sectionPromises);
    return results.filter((section): section is Section => section !== null);
};
