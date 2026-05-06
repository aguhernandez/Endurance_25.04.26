import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    'programs.title': 'Program Templates',
    'programs.subtitle': 'Pre-designed training programs for different goals and disciplines',
    'programs.filters': 'Filters',
    'programs.search': 'Search programs...',
    'programs.objective': 'Objective',
    'programs.discipline': 'Discipline',
    'programs.level': 'Level',
    'programs.all': 'All',
    'programs.results': 'programs found',
    'programs.loading': 'Loading programs...',
    'programs.noResults': 'No programs found',
    'programs.viewDetails': 'View Details',
    'programs.featured': 'Featured',
    'programs.weeks': 'weeks',
    'programs.sessionsPerWeek': 'sessions/wk',
    'programs.level.label': 'level',

    'objective.base.label': 'Base / Endurance',
    'objective.base.description': 'Build aerobic foundation and endurance capacity',
    'objective.vo2max.label': 'VO2max Development',
    'objective.vo2max.description': 'Maximize aerobic power and high-intensity capacity',
    'objective.threshold.label': 'Threshold / Tempo',
    'objective.threshold.description': 'Improve lactate threshold and sustainable pace',
    'objective.race_prep.label': 'Race Preparation',
    'objective.race_prep.description': 'Peak for competition with race-specific training',

    'discipline.cycling': 'Cycling',
    'discipline.running': 'Running',
    'discipline.swimming': 'Swimming',
    'discipline.triathlon': 'Triathlon',

    'level.beginner': 'Beginner',
    'level.intermediate': 'Intermediate',
    'level.advanced': 'Advanced',

    'settings.title': 'Settings',
    'settings.subtitle': 'Account & preferences',
    'settings.language': 'Language',
    'settings.languageDesc': 'Choose your preferred language',
    'settings.signOut': 'Sign Out',
    'settings.signOutDesc': 'Return to HUB login',
    'settings.footer': 'Asciende Lab · Powered by hub.asciende.pro',
  },
  es: {
    'programs.title': 'Plantillas de Programas',
    'programs.subtitle': 'Programas de entrenamiento pre-diseñados para diferentes objetivos y disciplinas',
    'programs.filters': 'Filtros',
    'programs.search': 'Buscar programas...',
    'programs.objective': 'Objetivo',
    'programs.discipline': 'Disciplina',
    'programs.level': 'Nivel',
    'programs.all': 'Todos',
    'programs.results': 'programas encontrados',
    'programs.loading': 'Cargando programas...',
    'programs.noResults': 'No se encontraron programas',
    'programs.viewDetails': 'Ver Detalles',
    'programs.featured': 'Destacado',
    'programs.weeks': 'semanas',
    'programs.sessionsPerWeek': 'sesiones/sem',
    'programs.level.label': 'nivel',

    'objective.base.label': 'Base / Resistencia',
    'objective.base.description': 'Construir base aeróbica y capacidad de resistencia',
    'objective.vo2max.label': 'Desarrollo de VO2max',
    'objective.vo2max.description': 'Maximizar potencia aeróbica y capacidad de alta intensidad',
    'objective.threshold.label': 'Umbral / Tempo',
    'objective.threshold.description': 'Mejorar umbral de lactato y ritmo sostenible',
    'objective.race_prep.label': 'Preparación de Carrera',
    'objective.race_prep.description': 'Alcanzar el pico con entrenamiento específico de carrera',

    'discipline.cycling': 'Ciclismo',
    'discipline.running': 'Carrera',
    'discipline.swimming': 'Natación',
    'discipline.triathlon': 'Triatlón',

    'level.beginner': 'Principiante',
    'level.intermediate': 'Intermedio',
    'level.advanced': 'Avanzado',

    'settings.title': 'Configuración',
    'settings.subtitle': 'Cuenta y preferencias',
    'settings.language': 'Idioma',
    'settings.languageDesc': 'Elige tu idioma preferido',
    'settings.signOut': 'Cerrar Sesión',
    'settings.signOutDesc': 'Volver al inicio del HUB',
    'settings.footer': 'Asciende Lab · Powered by hub.asciende.pro',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app_language');
    return (saved === 'en' || saved === 'es') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('app_language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
