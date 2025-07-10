
import React, { useState, useCallback } from 'react';
import { presentationData as initialData } from './data/content';
import { PresentationData, Section as SectionType, SlideData } from './types';
import { Slide } from './components/Slide';

const App: React.FC = () => {
    const [data, setData] = useState<PresentationData>(initialData);
    const [activeMainTab, setActiveMainTab] = useState<string>(data.mainNav[0].id);
    
    const initialSubTabs = data.sections.reduce((acc, section) => {
        if (section.subNav.length > 0) {
            acc[section.id] = section.subNav[0].id;
        }
        return acc;
    }, {} as Record<string, string>);

    const [activeSubTabs, setActiveSubTabs] = useState<Record<string, string>>(initialSubTabs);

    const handleUpdateSlide = useCallback((updatedSlideData: SlideData) => {
        setData(prevData => {
            const newData = { ...prevData };
            const sectionIndex = newData.sections.findIndex(s => s.id === activeMainTab);
            if (sectionIndex === -1) return prevData;

            const slideIndex = newData.sections[sectionIndex].slides.findIndex(s => s.id === updatedSlideData.id);
            if (slideIndex === -1) return prevData;

            const newSections = [...newData.sections];
            const newSlides = [...newSections[sectionIndex].slides];
            newSlides[slideIndex] = updatedSlideData;
            newSections[sectionIndex] = { ...newSections[sectionIndex], slides: newSlides };
            
            return { ...newData, sections: newSections };
        });
    }, [activeMainTab]);

    const activeSection: SectionType | undefined = data.sections.find(s => s.id === activeMainTab);
    const activeSlide: SlideData | undefined = activeSection?.slides.find(s => s.id === activeSubTabs[activeMainTab]);

    return (
        <div className="master-container max-w-7xl mx-auto my-5 bg-white rounded-2xl shadow-2xl shadow-slate-300/30 overflow-hidden font-sans">
            <header className="master-header bg-[#3949AB] text-white p-6 sm:p-10 text-center">
                <h1 className="text-3xl sm:text-4xl font-bold mb-1">{data.title}</h1>
                <h3 className="text-lg sm:text-xl font-normal opacity-90">{data.subtitle}</h3>
            </header>

            <nav className="main-navigation flex flex-wrap justify-between items-center gap-4 p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <div className="nav-logo">
                    <img src={data.logos[0].src} alt={data.logos[0].alt} className="max-h-12 object-contain" />
                </div>
                <div className="nav-buttons-container flex justify-center gap-3 flex-wrap">
                    {data.mainNav.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveMainTab(item.id)}
                            className={`py-3 px-6 text-sm sm:text-base font-semibold border-2 rounded-xl cursor-pointer transition-all duration-300 ease-in-out shadow-sm
                                ${activeMainTab === item.id 
                                    ? 'bg-blue-800 text-white border-blue-800 shadow-lg' 
                                    : 'text-blue-800 bg-white border-blue-400 hover:bg-blue-500 hover:text-white hover:-translate-y-0.5 hover:shadow-md'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
                <div className="nav-logo">
                     <img src={data.logos[1].src} alt={data.logos[1].alt} className="max-h-12 object-contain" />
                </div>
            </nav>

            <main className="main-content-area p-6 sm:p-10 min-h-[60vh]">
                {activeSection && (
                    <>
                        <nav className="sub-navigation flex flex-wrap justify-center gap-3 p-3 sm:p-4 bg-slate-100 rounded-xl mb-8">
                            {activeSection.subNav.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSubTabs(prev => ({...prev, [activeMainTab]: item.id}))}
                                    className={`py-2 px-4 sm:py-3 sm:px-6 text-sm sm:text-base font-semibold border-2 rounded-lg cursor-pointer transition-all duration-300 ease-in-out
                                        ${activeSubTabs[activeMainTab] === item.id 
                                            ? 'bg-blue-800 text-white border-blue-800 transform-none' 
                                            : 'text-blue-800 bg-transparent border-blue-400 hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:-translate-y-0.5'
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                        
                        <div className="sub-content-wrapper">
                           {activeSlide && (
                                <Slide 
                                    key={activeSlide.id} 
                                    slideData={activeSlide} 
                                    onUpdate={handleUpdateSlide} 
                                />
                           )}
                        </div>
                    </>
                )}
            </main>

            <footer className="footer text-center p-6 bg-gradient-to-r from-slate-50 to-slate-100 mt-8 text-sm text-slate-600 border-t border-slate-200">
                {data.footer}
            </footer>
        </div>
    );
};

export default App;
