import { useState, useEffect, useRef } from 'react';
import {
  Activity, TrendingUp, Users, Calendar, Zap, Award,
  ChevronRight, Play, ArrowRight, BarChart2, Heart,
  Wind, Layers, BookOpen, Target, Clock, Flame,
  Globe, Cpu, Radio, LogIn, Menu, X
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PublicLandingProps {
  onLogin: () => void;
}

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function MetricCard({ label, value, unit, delta, color, delay = 0 }: {
  label: string; value: string; unit: string; delta: string; color: string; delay?: number;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-body">{label}</p>
      <div className="flex items-end gap-1 mb-2">
        <span className="text-3xl font-heading text-white">{value}</span>
        <span className="text-sm text-gray-400 mb-1 font-body">{unit}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <TrendingUp className="w-3 h-3" style={{ color }} />
        <span className="text-xs font-body" style={{ color }}>{delta}</span>
      </div>
      <div className="mt-3 flex items-end gap-0.5 h-8">
        {[40, 55, 45, 70, 60, 85, 75, 90].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm transition-all duration-500"
            style={{
              height: inView ? `${h}%` : '4px',
              backgroundColor: color,
              opacity: 0.6 + i * 0.05,
              transitionDelay: `${delay + i * 50}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function LoadBar({ value, color, label }: { value: number; color: string; label: string }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className="mt-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400 font-body">{label}</span>
        <span className="text-xs font-body text-white">{value}%</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: inView ? `${value}%` : '0%',
            backgroundColor: color,
            transitionDelay: '200ms',
          }}
        />
      </div>
    </div>
  );
}

export default function PublicLanding({ onLogin }: PublicLandingProps) {
  const { t, language, setLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [carouselOffset, setCarouselOffset] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const metricsSection = useInView(0.1);
  const coachSection = useInView(0.15);
  const ecoSection = useInView(0.15);

  const wl = useCountUp(1847, 1800, metricsSection.inView);
  const athletes = useCountUp(248, 1600, metricsSection.inView);
  const sessions = useCountUp(12400, 2000, metricsSection.inView);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollCarousel = (dir: 'left' | 'right') => {
    const step = 320;
    const max = (trainingBlocks.length - 3) * step;
    setCarouselOffset(prev => {
      const next = prev + (dir === 'right' ? step : -step);
      return Math.max(0, Math.min(next, max));
    });
  };

  const trainingBlocks = [
    {
      title: language === 'es' ? 'Entrenamiento Base' : 'Base Training',
      discipline: language === 'es' ? 'Ciclismo' : 'Cycling',
      weeks: 8,
      color: 'from-blue-900/80 to-blue-800/60',
      accent: '#3b82f6',
      description: language === 'es'
        ? 'Construcción de la base aeróbica en intensidad Zona 2.'
        : 'Aerobic foundation building at Zone 2 intensity.',
      load: 72,
      tag: language === 'es' ? 'Base' : 'Foundation',
    },
    {
      title: language === 'es' ? 'Bloque VO2 Máx' : 'VO2 Max Block',
      discipline: language === 'es' ? 'Carrera' : 'Running',
      weeks: 4,
      color: 'from-red-900/80 to-red-800/60',
      accent: '#ef4444',
      description: language === 'es'
        ? 'Intervalos de alta intensidad para maximizar el consumo de oxígeno.'
        : 'High-intensity intervals targeting maximal oxygen uptake.',
      load: 91,
      tag: language === 'es' ? 'Pico' : 'Peak',
    },
    {
      title: language === 'es' ? 'Semana de Competencia' : 'Race Week Prep',
      discipline: language === 'es' ? 'Triatlón' : 'Triathlon',
      weeks: 1,
      color: 'from-amber-900/80 to-amber-800/60',
      accent: '#f59e0b',
      description: language === 'es'
        ? 'Afinamiento final y reducción para la competencia.'
        : 'Final sharpening and taper for competition.',
      load: 48,
      tag: language === 'es' ? 'Reducción' : 'Taper',
    },
    {
      title: language === 'es' ? 'Bloque de Recuperación' : 'Recovery Block',
      discipline: language === 'es' ? 'Multideporte' : 'Multi-sport',
      weeks: 2,
      color: 'from-emerald-900/80 to-emerald-800/60',
      accent: '#10b981',
      description: language === 'es'
        ? 'Ventana estructurada de adaptación y supercompensación.'
        : 'Structured adaptation and supercompensation window.',
      load: 35,
      tag: language === 'es' ? 'Recuperación' : 'Recovery',
    },
    {
      title: language === 'es' ? 'Foco en Escalada' : 'Climbing Focus',
      discipline: language === 'es' ? 'Ciclismo' : 'Cycling',
      weeks: 6,
      color: 'from-slate-800/80 to-slate-700/60',
      accent: '#94a3b8',
      description: language === 'es'
        ? 'Desarrollo de potencia/peso en gradientes sostenidos.'
        : 'Power-to-weight development on sustained gradients.',
      load: 83,
      tag: language === 'es' ? 'Fuerza' : 'Strength',
    },
    {
      title: language === 'es' ? 'Preparación Aguas Abiertas' : 'Open Water Prep',
      discipline: language === 'es' ? 'Natación' : 'Swimming',
      weeks: 3,
      color: 'from-cyan-900/80 to-cyan-800/60',
      accent: '#06b6d4',
      description: language === 'es'
        ? 'Técnica en aguas abiertas y acondicionamiento al ritmo de carrera.'
        : 'Open water technique and race-pace conditioning.',
      load: 67,
      tag: language === 'es' ? 'Técnica' : 'Technique',
    },
  ];

  const ecosystemItems = [
    { name: 'Academy', icon: BookOpen, description: t('eco.academy.desc'), color: '#3b82f6', bg: 'bg-blue-500/10 border-blue-500/20' },
    { name: language === 'es' ? 'Nutrición' : 'Nutrition', icon: Flame, description: t('eco.nutrition.desc'), color: '#f59e0b', bg: 'bg-amber-500/10 border-amber-500/20' },
    { name: 'Lab', icon: Cpu, description: t('eco.lab.desc'), color: '#10b981', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { name: 'Hub', icon: Radio, description: t('eco.hub.desc'), color: '#fdda36', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  ];

  const navItems = [
    { label: t('nav.platform'), href: '#platform' },
    { label: t('nav.trainingBlocks'), href: '#training-blocks' },
    { label: t('nav.coaches'), href: '#coaches' },
    { label: t('nav.ecosystem'), href: '#ecosystem' },
  ];

  return (
    <div className="min-h-screen bg-[#080c10] text-white overflow-x-hidden">

      {/* ─── NAV ─── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-[#080c10]/95 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/logo_transp.png" alt="Asciende" className="h-8 w-auto" />
            <span className="hidden sm:block text-sm font-body font-semibold tracking-widest text-[#fdda36] uppercase">
              Endurance
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-body text-gray-400 hover:text-white transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA + language toggle */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 text-xs font-body text-gray-400 hover:text-white hover:border-white/30 transition-all duration-200"
              title={language === 'en' ? 'Switch to Spanish' : 'Cambiar a inglés'}
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:block">{language === 'en' ? 'ES' : 'EN'}</span>
            </button>

            <button
              onClick={onLogin}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-sm font-body text-gray-300 hover:text-white hover:border-white/40 transition-all duration-200"
            >
              <LogIn className="w-4 h-4" />
              {t('nav.login')}
            </button>
            <button
              onClick={onLogin}
              className="px-4 py-2 rounded-lg text-sm font-body font-semibold text-[#080c10] transition-all duration-200 hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: '#fdda36' }}
            >
              {t('nav.getStarted')}
            </button>
            <button
              className="md:hidden p-2 text-gray-400"
              onClick={() => setMobileMenuOpen(v => !v)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#080c10]/98 backdrop-blur-xl border-t border-white/5 px-6 py-4 space-y-3">
            {navItems.map(item => (
              <a
                key={item.href}
                href={item.href}
                className="block text-sm font-body text-gray-300 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={onLogin}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-white/20 text-sm font-body text-gray-300 mt-2"
            >
              <LogIn className="w-4 h-4" /> {t('nav.login')}
            </button>
          </div>
        )}
      </header>

      {/* ─── HERO ─── */}
      <section id="platform" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#080c10] via-[#0d1520] to-[#080c10]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(253,218,54,0.04) 0%, transparent 70%)' }} />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />
          <div className="absolute top-20 right-1/4 w-64 h-64 rounded-full blur-3xl"
            style={{ background: 'rgba(59,130,246,0.06)', animation: 'pulse 4s ease-in-out infinite' }} />
          <div className="absolute bottom-32 left-1/4 w-80 h-80 rounded-full blur-3xl"
            style={{ background: 'rgba(253,218,54,0.04)', animation: 'pulse 6s ease-in-out infinite 2s' }} />
        </div>

        <div ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-24 pb-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-96px)]">
            {/* Left */}
            <div>
              <div className="flex items-center gap-2 mb-8">
                <div className="w-2 h-2 rounded-full bg-[#fdda36] animate-pulse" />
                <span className="text-xs font-body uppercase tracking-widest text-[#fdda36]">
                  {t('hero.eyebrow')}
                </span>
              </div>

              <h1 className="font-heading leading-[1.05] mb-6">
                <span className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white">
                  {t('hero.headline1')}
                </span>
                <span className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl" style={{ color: '#fdda36' }}>
                  {t('hero.headline2')}
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-400 font-body leading-relaxed mb-4 max-w-xl">
                {t('hero.sub')}
              </p>
              <p className="text-sm text-gray-500 font-body leading-relaxed mb-10 max-w-lg">
                {t('hero.body')}
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="#training-blocks"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-body font-semibold text-[#080c10] transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/20"
                  style={{ backgroundColor: '#fdda36' }}
                >
                  {t('hero.cta.explore')}
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  onClick={onLogin}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-body font-semibold text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-200"
                >
                  <Play className="w-4 h-4 fill-white" />
                  {t('hero.cta.login')}
                </button>
              </div>

              {/* Stats */}
              <div className="mt-12 pt-8 border-t border-white/5 flex items-center gap-8">
                <div>
                  <p className="text-2xl font-heading text-white">{athletes.toLocaleString()}+</p>
                  <p className="text-xs text-gray-500 font-body uppercase tracking-wider">{t('hero.stat.athletes')}</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <p className="text-2xl font-heading text-white">{sessions.toLocaleString()}+</p>
                  <p className="text-xs text-gray-500 font-body uppercase tracking-wider">{t('hero.stat.sessions')}</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <p className="text-2xl font-heading text-white">{wl.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 font-body uppercase tracking-wider">{t('hero.stat.hours')}</p>
                </div>
              </div>
            </div>

            {/* Right: analytics preview */}
            <div className="relative">
              <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-gray-500 font-body uppercase tracking-widest">{t('hero.card.weekly')}</p>
                    <p className="text-lg font-heading text-white mt-0.5">{t('hero.card.performance')}</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-emerald-400 font-body">{t('hero.card.live')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                      <circle cx="40" cy="40" r="32" fill="none" stroke="#fdda36" strokeWidth="6"
                        strokeLinecap="round" strokeDasharray="201" strokeDashoffset="50"
                        style={{ filter: 'drop-shadow(0 0 8px rgba(253,218,54,0.4))' }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-heading text-white">87</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-3xl font-heading text-white">87<span className="text-lg text-gray-400">/100</span></p>
                    <p className="text-xs text-emerald-400 font-body flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" /> {t('hero.card.delta')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <MetricCard label={t('metric.trainingLoad')} value="342" unit="TSS" delta={t('metric.delta.load')} color="#3b82f6" delay={0} />
                  <MetricCard label={t('metric.recovery')} value="78" unit="%" delta={t('metric.delta.recovery')} color="#10b981" delay={100} />
                  <MetricCard label={t('metric.weeklyVolume')} value="14.2" unit="hrs" delta={t('metric.delta.volume')} color="#fdda36" delay={200} />
                  <MetricCard label={t('metric.readiness')} value="91" unit="%" delta={t('metric.delta.readiness')} color="#ef4444" delay={300} />
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-[#0d1520] border border-white/10 rounded-2xl p-4 shadow-2xl" style={{ minWidth: '180px' }}>
                <p className="text-xs text-gray-500 font-body uppercase tracking-wider mb-2">{t('hero.card.ftp')}</p>
                <p className="text-2xl font-heading text-white">284 <span className="text-sm text-gray-400 font-body">W</span></p>
                <div className="flex items-center gap-2 mt-1">
                  <Zap className="w-3 h-3 text-[#fdda36]" />
                  <span className="text-xs text-[#fdda36] font-body">4.1 W/kg</span>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-[#0d1520] border border-white/10 rounded-2xl p-4 shadow-2xl" style={{ minWidth: '160px' }}>
                <p className="text-xs text-gray-500 font-body uppercase tracking-wider mb-2">{t('hero.card.zone')}</p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <p className="text-sm font-body text-white font-semibold">{t('hero.card.zoneLabel')}</p>
                </div>
                <p className="text-xs text-gray-500 font-body mt-1">{t('hero.card.zoneTarget')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/20" />
          <p className="text-xs text-gray-600 font-body uppercase tracking-widest">{t('hero.scroll')}</p>
        </div>
      </section>

      {/* ─── METRICS DASHBOARD ─── */}
      <section id="platform-metrics" ref={metricsSection.ref} className="py-24 bg-[#080c10]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div
            className="mb-16 max-w-2xl"
            style={{
              opacity: metricsSection.inView ? 1 : 0,
              transform: metricsSection.inView ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 className="w-4 h-4 text-[#fdda36]" />
              <span className="text-xs font-body uppercase tracking-widest text-[#fdda36]">{t('metrics.eyebrow')}</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-4">
              {t('metrics.headline1')}<br />{t('metrics.headline2')}
            </h2>
            <p className="text-gray-400 font-body leading-relaxed">{t('metrics.body')}</p>
          </div>

          <div
            className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 lg:p-8"
            style={{
              opacity: metricsSection.inView ? 1 : 0,
              transform: metricsSection.inView ? 'translateY(0)' : 'translateY(40px)',
              transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
            }}
          >
            <div className="flex items-center gap-1 mb-8 border-b border-white/5 pb-4 overflow-x-auto">
              {[
                t('metrics.tab.overview'),
                t('metrics.tab.power'),
                t('metrics.tab.load'),
                t('metrics.tab.recovery'),
                t('metrics.tab.volume'),
              ].map((tab, i) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-lg text-sm font-body whitespace-nowrap transition-all ${
                    i === 0 ? 'bg-[#fdda36] text-[#080c10] font-semibold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <p className="text-xs text-gray-500 font-body uppercase tracking-widest mb-4">{t('metrics.chart.label')}</p>
                <div className="h-48 flex items-end gap-2">
                  {[55, 65, 70, 62, 80, 75, 85, 78, 92, 88, 95, 87].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-sm transition-all duration-700"
                        style={{
                          height: metricsSection.inView ? `${h}%` : '4px',
                          background: i === 11 ? '#fdda36' : 'linear-gradient(to top, rgba(59,130,246,0.8), rgba(59,130,246,0.3))',
                          transitionDelay: `${i * 60}ms`,
                        }}
                      />
                      <span className="text-[10px] text-gray-600 font-body">{t('metrics.week')}{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { labelKey: 'metrics.chronicLoad', value: '342', change: '+8%', color: '#3b82f6' },
                  { labelKey: 'metrics.acuteLoad', value: '410', change: '+15%', color: '#ef4444' },
                  { labelKey: 'metrics.form', value: '-68', change: t('metrics.peakFit'), color: '#fdda36' },
                  { labelKey: 'metrics.monotony', value: '1.2', change: t('metrics.optimal'), color: '#10b981' },
                ].map(stat => (
                  <div key={stat.labelKey} className="flex items-center justify-between bg-white/[0.03] rounded-xl px-4 py-3">
                    <div>
                      <p className="text-xs text-gray-500 font-body">{t(stat.labelKey)}</p>
                      <p className="text-xl font-heading text-white">{stat.value}</p>
                    </div>
                    <span className="text-xs font-body px-2 py-1 rounded-full" style={{ color: stat.color, backgroundColor: `${stat.color}15` }}>
                      {stat.change}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRAINING BLOCKS CAROUSEL ─── */}
      <section id="training-blocks" className="py-24 bg-[#060a0e]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-4 h-4 text-[#fdda36]" />
                <span className="text-xs font-body uppercase tracking-widest text-[#fdda36]">{t('blocks.eyebrow')}</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
                {t('blocks.headline1')}<br />{t('blocks.headline2')}
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scrollCarousel('left')}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/40 transition-all"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/40 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-hidden">
            <div
              className="flex gap-5 transition-transform duration-500"
              style={{ transform: `translateX(-${carouselOffset}px)` }}
            >
              {trainingBlocks.map((block) => (
                <div key={block.title} className="flex-none w-72 sm:w-80 cursor-pointer group">
                  <div
                    className={`relative h-64 rounded-2xl bg-gradient-to-br ${block.color} border border-white/10 p-6 overflow-hidden transition-all duration-300 group-hover:scale-[1.02] group-hover:border-white/20 group-hover:shadow-2xl`}
                  >
                    <div className="absolute inset-0 opacity-[0.04]"
                      style={{ backgroundImage: 'radial-gradient(circle at 100% 100%, rgba(255,255,255,0.8) 0%, transparent 50%)' }} />

                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-body font-semibold mb-4"
                      style={{ backgroundColor: `${block.accent}20`, color: block.accent, border: `1px solid ${block.accent}30` }}
                    >
                      {block.tag}
                    </div>

                    <h3 className="font-heading text-xl text-white mb-1">{block.title}</h3>
                    <p className="text-xs text-gray-400 font-body mb-1">{block.discipline}</p>
                    <p className="text-xs text-gray-500 font-body leading-relaxed mb-4">{block.description}</p>

                    <div className="absolute bottom-6 left-6 right-6">
                      <LoadBar value={block.load} color={block.accent} label={t('blocks.trainingLoad')} />
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500 font-body">{block.weeks} {t('blocks.weeks')}</span>
                        </div>
                        <div
                          className="flex items-center gap-1 text-xs font-body opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ color: block.accent }}
                        >
                          {t('blocks.viewBlock')} <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── COACH WORKFLOW PREVIEW ─── */}
      <section id="coaches" ref={coachSection.ref} className="py-24 bg-[#080c10]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: UI mock */}
            <div
              style={{
                opacity: coachSection.inView ? 1 : 0,
                transform: coachSection.inView ? 'translateX(0)' : 'translateX(-40px)',
                transition: 'opacity 0.8s ease, transform 0.8s ease',
              }}
            >
              <div className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#fdda36] flex items-center justify-center">
                      <Users className="w-4 h-4 text-[#080c10]" />
                    </div>
                    <div>
                      <p className="text-sm font-heading text-white">{t('coach.panel.title')}</p>
                      <p className="text-xs text-gray-500 font-body">12 {t('coach.panel.subtitle')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-xs text-emerald-400 font-body">{t('coach.panel.allOnTrack')}</span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  {[
                    { name: 'Alex M.', event: 'IM Frankfurt', days: 42, load: 88, status: 'peak' },
                    { name: 'Sara K.', event: 'Ironman 70.3', days: 18, load: 52, status: 'taper' },
                    { name: 'Tom R.', event: 'Gran Fondo', days: 76, load: 71, status: 'build' },
                    { name: 'Lisa P.', event: 'Boston Marathon', days: 31, load: 94, status: 'peak' },
                  ].map(athlete => (
                    <div key={athlete.name} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-pointer group">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-xs font-heading text-white flex-shrink-0">
                        {athlete.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-body font-semibold text-white">{athlete.name}</p>
                        <p className="text-xs text-gray-500 font-body truncate">{athlete.event} · {athlete.days}d</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${athlete.load}%`,
                              backgroundColor: athlete.status === 'peak' ? '#ef4444' : athlete.status === 'taper' ? '#3b82f6' : '#fdda36',
                            }}
                          />
                        </div>
                        <span
                          className="text-xs font-body px-2 py-0.5 rounded-full"
                          style={{
                            color: athlete.status === 'peak' ? '#ef4444' : athlete.status === 'taper' ? '#3b82f6' : '#fdda36',
                            backgroundColor: athlete.status === 'peak' ? '#ef444415' : athlete.status === 'taper' ? '#3b82f615' : '#fdda3615',
                          }}
                        >
                          {t(`coach.status.${athlete.status}`)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-4 pb-4">
                  <div className="bg-white/[0.02] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-gray-500 font-body uppercase tracking-wider">{t('coach.panel.thisWeek')}</p>
                      <Calendar className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                        <div key={i} className="text-center">
                          <p className="text-[10px] text-gray-600 font-body mb-1">{d}</p>
                          <div
                            className="h-8 rounded-lg flex items-center justify-center"
                            style={{
                              backgroundColor: [0, 2, 4].includes(i) ? 'rgba(59,130,246,0.2)' : i === 5 ? 'rgba(253,218,54,0.2)' : 'rgba(255,255,255,0.02)',
                              border: `1px solid ${[0, 2, 4].includes(i) ? 'rgba(59,130,246,0.3)' : i === 5 ? 'rgba(253,218,54,0.3)' : 'transparent'}`,
                            }}
                          >
                            {[0, 2, 4].includes(i) && <Wind className="w-3 h-3 text-blue-400" />}
                            {i === 5 && <Activity className="w-3 h-3 text-yellow-400" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Text */}
            <div
              style={{
                opacity: coachSection.inView ? 1 : 0,
                transform: coachSection.inView ? 'translateX(0)' : 'translateX(40px)',
                transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-4 h-4 text-[#fdda36]" />
                <span className="text-xs font-body uppercase tracking-widest text-[#fdda36]">{t('coach.eyebrow')}</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-6">
                {t('coach.headline1')}<br />{t('coach.headline2')}
              </h2>
              <p className="text-gray-400 font-body leading-relaxed mb-8">{t('coach.body')}</p>

              <div className="space-y-4">
                {[
                  { icon: Users, titleKey: 'coach.feature.athletes', descKey: 'coach.feature.athletes.desc' },
                  { icon: Calendar, titleKey: 'coach.feature.calendar', descKey: 'coach.feature.calendar.desc' },
                  { icon: Heart, titleKey: 'coach.feature.readiness', descKey: 'coach.feature.readiness.desc' },
                  { icon: Award, titleKey: 'coach.feature.race', descKey: 'coach.feature.race.desc' },
                ].map(feature => (
                  <div key={feature.titleKey} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-[#fdda36]/10 border border-[#fdda36]/20 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-[#fdda36]" />
                    </div>
                    <div>
                      <p className="text-sm font-body font-semibold text-white mb-0.5">{t(feature.titleKey)}</p>
                      <p className="text-xs text-gray-500 font-body leading-relaxed">{t(feature.descKey)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={onLogin}
                className="mt-8 flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-body font-semibold text-[#080c10] transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/20"
                style={{ backgroundColor: '#fdda36' }}
              >
                {t('coach.cta')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ECOSYSTEM ─── */}
      <section id="ecosystem" ref={ecoSection.ref} className="py-24 bg-[#060a0e]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div
            className="text-center mb-16"
            style={{
              opacity: ecoSection.inView ? 1 : 0,
              transform: ecoSection.inView ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-[#fdda36]" />
              <span className="text-xs font-body uppercase tracking-widest text-[#fdda36]">{t('eco.eyebrow')}</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-4">
              {t('eco.headline1')}<br />{t('eco.headline2')}
            </h2>
            <p className="text-gray-400 font-body leading-relaxed max-w-xl mx-auto">{t('eco.body')}</p>
          </div>

          <div className="relative flex items-center justify-center mb-16">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg className="w-full h-full max-w-2xl" viewBox="0 0 400 200" fill="none">
                {[{x: 60, y: 100}, {x: 340, y: 100}, {x: 200, y: 20}, {x: 200, y: 180}].map((pt, i) => (
                  <line key={i} x1="200" y1="100" x2={pt.x} y2={pt.y}
                    stroke="rgba(253,218,54,0.15)" strokeWidth="1" strokeDasharray="4 4"
                    style={{ opacity: ecoSection.inView ? 1 : 0, transition: `opacity 0.5s ease ${i * 150 + 300}ms` }} />
                ))}
              </svg>
            </div>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="px-6 py-4 rounded-2xl text-center" style={{ background: 'rgba(253,218,54,0.1)', border: '1px solid rgba(253,218,54,0.3)' }}>
                <Activity className="w-6 h-6 mx-auto mb-1" style={{ color: '#fdda36' }} />
                <p className="text-sm font-heading text-white">Endurance</p>
                <p className="text-xs text-[#fdda36] font-body">Core</p>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ecosystemItems.map((item, i) => (
              <div
                key={item.name}
                className={`rounded-2xl p-6 border ${item.bg} transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer`}
                style={{
                  opacity: ecoSection.inView ? 1 : 0,
                  transform: ecoSection.inView ? 'translateY(0)' : 'translateY(30px)',
                  transition: `opacity 0.6s ease ${i * 120 + 200}ms, transform 0.6s ease ${i * 120 + 200}ms`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${item.color}15`, border: `1px solid ${item.color}25` }}
                >
                  <item.icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <h3 className="font-heading text-lg text-white mb-2">{item.name}</h3>
                <p className="text-sm text-gray-400 font-body leading-relaxed">{item.description}</p>
                <div className="mt-4 flex items-center gap-1" style={{ color: item.color }}>
                  <span className="text-xs font-body">{t('eco.learnMore')}</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FOOTER ─── */}
      <section className="py-24 bg-[#080c10] border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fdda36]/10 border border-[#fdda36]/20 mb-8">
            <Zap className="w-4 h-4 text-[#fdda36]" />
            <span className="text-xs font-body text-[#fdda36] uppercase tracking-widest">{t('cta.eyebrow')}</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6">
            {t('cta.headline1')}<br />{t('cta.headline2')}
          </h2>
          <p className="text-gray-400 font-body leading-relaxed mb-10 max-w-xl mx-auto">{t('cta.body')}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onLogin}
              className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-body font-semibold text-[#080c10] transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20"
              style={{ backgroundColor: '#fdda36' }}
            >
              <LogIn className="w-5 h-5" />
              {t('cta.access')}
            </button>
            <a
              href="#training-blocks"
              className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-body font-semibold text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-200"
            >
              {t('cta.explore')}
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo_transp.png" alt="Asciende" className="h-6 w-auto opacity-60" />
            <span className="text-xs text-gray-600 font-body">Asciende Endurance</span>
          </div>
          <p className="text-xs text-gray-700 font-body">{t('footer.tagline')}</p>
        </div>
      </section>
    </div>
  );
}
