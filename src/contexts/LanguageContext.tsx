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

    'nav.platform': 'Platform',
    'nav.trainingBlocks': 'Training Blocks',
    'nav.coaches': 'Coaches',
    'nav.ecosystem': 'Ecosystem',
    'nav.login': 'Login',
    'nav.getStarted': 'Get Started',

    'hero.eyebrow': 'Performance Platform',
    'hero.headline1': 'Train With',
    'hero.headline2': 'Structure.',
    'hero.sub': 'Performance planning for endurance athletes.',
    'hero.body': 'Intelligent periodization, real-time analytics, and coach-athlete collaboration — built for cyclists, runners, swimmers, and triathletes who demand precision.',
    'hero.cta.explore': 'Explore Platform',
    'hero.cta.login': 'Login',
    'hero.stat.athletes': 'Athletes',
    'hero.stat.sessions': 'Sessions Planned',
    'hero.stat.hours': 'Hours Logged',
    'hero.scroll': 'Scroll',

    'metrics.eyebrow': 'Analytics',
    'metrics.headline1': 'Data-Driven',
    'metrics.headline2': 'Endurance Intelligence',
    'metrics.body': 'Every training decision backed by science. Track load, recovery, readiness, and power across all endurance disciplines in one unified platform.',
    'metrics.tab.overview': 'Overview',
    'metrics.tab.power': 'Power Curve',
    'metrics.tab.load': 'Training Load',
    'metrics.tab.recovery': 'Recovery',
    'metrics.tab.volume': 'Volume',
    'metrics.chart.label': '12-Week Training Load',
    'metrics.week': 'W',
    'metrics.chronicLoad': 'Chronic Load',
    'metrics.acuteLoad': 'Acute Load',
    'metrics.form': 'Form (TSB)',
    'metrics.monotony': 'Monotony',
    'metrics.peakFit': 'Peak fit',
    'metrics.optimal': 'Optimal',

    'metric.trainingLoad': 'Training Load',
    'metric.recovery': 'Recovery',
    'metric.weeklyVolume': 'Weekly Volume',
    'metric.readiness': 'Readiness',
    'metric.delta.load': '+12% this week',
    'metric.delta.recovery': 'Optimal',
    'metric.delta.volume': '+1.8h vs plan',
    'metric.delta.readiness': 'Peak form',

    'hero.card.weekly': 'Weekly Overview',
    'hero.card.performance': 'Performance Score',
    'hero.card.live': 'Live',
    'hero.card.ftp': 'FTP Power',
    'hero.card.zone': 'Zone Today',
    'hero.card.zoneLabel': 'Zone 2 — Base',
    'hero.card.zoneTarget': '2:30:00 target',
    'hero.card.delta': '+4 from last week',

    'blocks.eyebrow': 'Training Blocks',
    'blocks.headline1': 'Structured',
    'blocks.headline2': 'Periodization',
    'blocks.trainingLoad': 'Training Load',
    'blocks.weeks': 'weeks',
    'blocks.viewBlock': 'View Block',

    'coach.eyebrow': 'Coaching Tools',
    'coach.headline1': 'Built For',
    'coach.headline2': 'Endurance Coaches',
    'coach.body': 'Manage entire athlete rosters from a single interface. Plan periodization cycles, track readiness in real time, and coordinate across all disciplines with a unified coaching workflow.',
    'coach.feature.athletes': 'Athlete Management',
    'coach.feature.athletes.desc': 'Complete roster oversight with individual load tracking.',
    'coach.feature.calendar': 'Planning Calendar',
    'coach.feature.calendar.desc': 'Drag-and-drop periodization across weeks and mesocycles.',
    'coach.feature.readiness': 'Readiness Monitoring',
    'coach.feature.readiness.desc': 'Automated alerts when athletes approach overtraining thresholds.',
    'coach.feature.race': 'Race Planning',
    'coach.feature.race.desc': 'A-event targeting with reverse-engineered periodization.',
    'coach.cta': 'Start Coaching',
    'coach.panel.title': 'Coach Overview',
    'coach.panel.subtitle': 'Active Athletes',
    'coach.panel.allOnTrack': 'All on track',
    'coach.panel.thisWeek': 'This Week',
    'coach.status.peak': 'peak',
    'coach.status.taper': 'taper',
    'coach.status.build': 'build',

    'eco.eyebrow': 'Connected Ecosystem',
    'eco.headline1': 'One Platform.',
    'eco.headline2': 'Every Dimension.',
    'eco.body': 'Endurance is part of a connected performance ecosystem. Every module shares data, synchronizes plans, and amplifies your coaching impact.',
    'eco.learnMore': 'Learn more',
    'eco.academy.desc': 'Structured learning paths for coaches and athletes.',
    'eco.nutrition.desc': 'Fueling protocols aligned with training periodization.',
    'eco.lab.desc': 'Physiology testing and threshold calibration tools.',
    'eco.hub.desc': 'Central platform connecting all ecosystem services.',

    'cta.eyebrow': 'Ready to perform',
    'cta.headline1': 'Start Training',
    'cta.headline2': 'With Precision.',
    'cta.body': 'Join endurance athletes and coaches using structured periodization, real-time analytics, and intelligent planning to reach peak performance.',
    'cta.access': 'Access Platform',
    'cta.explore': 'Explore Features',
    'footer.tagline': 'Performance Planning · Analytics · Coaching Tools',

    'login.title': 'Welcome back',
    'login.subtitle': 'Sign in to your Asciende account',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.submit': 'Sign In',
    'login.submitting': 'Signing in...',
    'login.register': "Don't have an account?",
    'login.registerLink': 'Register on Hub',
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

    'nav.platform': 'Plataforma',
    'nav.trainingBlocks': 'Bloques de Entrenamiento',
    'nav.coaches': 'Entrenadores',
    'nav.ecosystem': 'Ecosistema',
    'nav.login': 'Ingresar',
    'nav.getStarted': 'Comenzar',

    'hero.eyebrow': 'Plataforma de Rendimiento',
    'hero.headline1': 'Entrena Con',
    'hero.headline2': 'Estructura.',
    'hero.sub': 'Planificación de rendimiento para atletas de resistencia.',
    'hero.body': 'Periodización inteligente, analítica en tiempo real y colaboración entrenador-atleta — diseñada para ciclistas, corredores, nadadores y triatletas que exigen precisión.',
    'hero.cta.explore': 'Explorar Plataforma',
    'hero.cta.login': 'Ingresar',
    'hero.stat.athletes': 'Atletas',
    'hero.stat.sessions': 'Sesiones Planificadas',
    'hero.stat.hours': 'Horas Registradas',
    'hero.scroll': 'Desplazar',

    'metrics.eyebrow': 'Analítica',
    'metrics.headline1': 'Inteligencia de',
    'metrics.headline2': 'Resistencia Basada en Datos',
    'metrics.body': 'Cada decisión de entrenamiento respaldada por ciencia. Seguimiento de carga, recuperación, disposición y potencia en todas las disciplinas de resistencia en una sola plataforma.',
    'metrics.tab.overview': 'General',
    'metrics.tab.power': 'Curva de Potencia',
    'metrics.tab.load': 'Carga de Entrenamiento',
    'metrics.tab.recovery': 'Recuperación',
    'metrics.tab.volume': 'Volumen',
    'metrics.chart.label': 'Carga de Entrenamiento — 12 Semanas',
    'metrics.week': 'S',
    'metrics.chronicLoad': 'Carga Crónica',
    'metrics.acuteLoad': 'Carga Aguda',
    'metrics.form': 'Forma (TSB)',
    'metrics.monotony': 'Monotonía',
    'metrics.peakFit': 'Pico de forma',
    'metrics.optimal': 'Óptimo',

    'metric.trainingLoad': 'Carga de Entrenamiento',
    'metric.recovery': 'Recuperación',
    'metric.weeklyVolume': 'Volumen Semanal',
    'metric.readiness': 'Disposición',
    'metric.delta.load': '+12% esta semana',
    'metric.delta.recovery': 'Óptimo',
    'metric.delta.volume': '+1.8h vs plan',
    'metric.delta.readiness': 'Forma pico',

    'hero.card.weekly': 'Resumen Semanal',
    'hero.card.performance': 'Puntuación de Rendimiento',
    'hero.card.live': 'En vivo',
    'hero.card.ftp': 'Potencia FTP',
    'hero.card.zone': 'Zona Hoy',
    'hero.card.zoneLabel': 'Zona 2 — Base',
    'hero.card.zoneTarget': 'Objetivo 2:30:00',
    'hero.card.delta': '+4 respecto a la semana pasada',

    'blocks.eyebrow': 'Bloques de Entrenamiento',
    'blocks.headline1': 'Periodización',
    'blocks.headline2': 'Estructurada',
    'blocks.trainingLoad': 'Carga de Entrenamiento',
    'blocks.weeks': 'semanas',
    'blocks.viewBlock': 'Ver Bloque',

    'coach.eyebrow': 'Herramientas de Entrenamiento',
    'coach.headline1': 'Diseñado Para',
    'coach.headline2': 'Entrenadores de Resistencia',
    'coach.body': 'Gestiona plantillas completas desde una sola interfaz. Planifica ciclos de periodización, monitorea la disposición en tiempo real y coordina todas las disciplinas con un flujo de trabajo unificado.',
    'coach.feature.athletes': 'Gestión de Atletas',
    'coach.feature.athletes.desc': 'Supervisión completa del plantel con seguimiento individual de carga.',
    'coach.feature.calendar': 'Calendario de Planificación',
    'coach.feature.calendar.desc': 'Periodización arrastra y suelta por semanas y mesociclos.',
    'coach.feature.readiness': 'Monitoreo de Disposición',
    'coach.feature.readiness.desc': 'Alertas automáticas cuando los atletas se acercan a umbrales de sobreentrenamiento.',
    'coach.feature.race': 'Planificación de Competencias',
    'coach.feature.race.desc': 'Objetivo de evento A con periodización de ingeniería inversa.',
    'coach.cta': 'Comenzar a Entrenar',
    'coach.panel.title': 'Vista del Entrenador',
    'coach.panel.subtitle': 'Atletas Activos',
    'coach.panel.allOnTrack': 'Todos en curso',
    'coach.panel.thisWeek': 'Esta Semana',
    'coach.status.peak': 'pico',
    'coach.status.taper': 'reducción',
    'coach.status.build': 'construcción',

    'eco.eyebrow': 'Ecosistema Conectado',
    'eco.headline1': 'Una Plataforma.',
    'eco.headline2': 'Cada Dimensión.',
    'eco.body': 'Endurance es parte de un ecosistema de rendimiento conectado. Cada módulo comparte datos, sincroniza planes y amplifica el impacto del entrenamiento.',
    'eco.learnMore': 'Saber más',
    'eco.academy.desc': 'Rutas de aprendizaje estructuradas para entrenadores y atletas.',
    'eco.nutrition.desc': 'Protocolos de nutrición alineados con la periodización del entrenamiento.',
    'eco.lab.desc': 'Pruebas de fisiología y herramientas de calibración de umbrales.',
    'eco.hub.desc': 'Plataforma central que conecta todos los servicios del ecosistema.',

    'cta.eyebrow': 'Listo para rendir',
    'cta.headline1': 'Comienza a Entrenar',
    'cta.headline2': 'Con Precisión.',
    'cta.body': 'Únete a atletas y entrenadores de resistencia que usan periodización estructurada, analítica en tiempo real y planificación inteligente para alcanzar el rendimiento máximo.',
    'cta.access': 'Acceder a la Plataforma',
    'cta.explore': 'Explorar Funciones',
    'footer.tagline': 'Planificación de Rendimiento · Analítica · Herramientas de Entrenamiento',

    'login.title': 'Bienvenido de nuevo',
    'login.subtitle': 'Inicia sesión en tu cuenta Asciende',
    'login.email': 'Correo electrónico',
    'login.password': 'Contraseña',
    'login.submit': 'Iniciar Sesión',
    'login.submitting': 'Iniciando sesión...',
    'login.register': '¿No tienes cuenta?',
    'login.registerLink': 'Regístrate en Hub',
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
