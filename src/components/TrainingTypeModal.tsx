import { useState, useRef, useEffect } from 'react';
import { X, ChevronRight, Mountain, Clock, ChevronDown } from 'lucide-react';

interface TrainingTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (discipline: string, type: string, opts?: { elevationM?: number; scheduledTime?: string }) => void;
  selectedDate?: Date | null;
}

const SPORTS = [
  {
    id: 'cycling',
    label: 'Cycling',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.8">
        <circle cx="8" cy="22" r="6" /><circle cx="24" cy="22" r="6" />
        <path d="M8 22l5-10h6l3 6M14 12l4-5h4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50 dark:bg-amber-900/10',
    border: 'border-amber-200 dark:border-amber-800',
    accent: '#F59E0B',
    subs: [
      { id: 'road', label: 'Road', icon: '🛣️', desc: 'Pavement & road cycling', hasElevation: false },
      { id: 'gravel', label: 'Gravel', icon: '🪨', desc: 'Mixed terrain & gravel roads', hasElevation: true },
      { id: 'mtb', label: 'Mountain Bike', icon: '⛰️', desc: 'Off-road & trail riding', hasElevation: true },
      { id: 'indoor', label: 'Indoor / Trainer', icon: '🏠', desc: 'Smart trainer & indoor cycling', hasElevation: false },
    ],
  },
  {
    id: 'running',
    label: 'Running',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.8">
        <circle cx="18" cy="6" r="2.5" />
        <path d="M15 9l-3 8 4 3-2 7M15 9l5 2 3-4M12 17l-4 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'from-emerald-400 to-teal-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/10',
    border: 'border-emerald-200 dark:border-emerald-800',
    accent: '#10B981',
    subs: [
      { id: 'road-running', label: 'Road', icon: '🛣️', desc: 'Flat & paved surfaces', hasElevation: false },
      { id: 'track', label: 'Track', icon: '🏟️', desc: 'Oval track training', hasElevation: false },
      { id: 'trail', label: 'Trail Running', icon: '🌲', desc: 'Off-road & natural terrain', hasElevation: true },
      { id: 'treadmill', label: 'Treadmill', icon: '⚙️', desc: 'Indoor treadmill session', hasElevation: false },
    ],
  },
  {
    id: 'swimming',
    label: 'Swimming',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 18c2-3 4-3 6 0s4 3 6 0 4-3 6 0 4 3 4 0M8 14l3-6 5 4 4-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'from-cyan-400 to-blue-500',
    bg: 'bg-cyan-50 dark:bg-cyan-900/10',
    border: 'border-cyan-200 dark:border-cyan-800',
    accent: '#06B6D4',
    subs: [
      { id: 'pool', label: 'Pool', icon: '🏊', desc: 'Lane swimming in pool', hasElevation: false },
      { id: 'open-water', label: 'Open Water', icon: '🌊', desc: 'Lake, sea & river swimming', hasElevation: false },
    ],
  },
];

const TIMES = [
  '05:00', '05:30', '06:00', '06:30', '07:00', '07:30',
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '12:00', '13:00', '14:00', '15:00', '16:00',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '21:00',
];

export default function TrainingTypeModal({ isOpen, onClose, onSelect, selectedDate }: TrainingTypeModalProps) {
  const [step, setStep] = useState<'sport' | 'sub' | 'details'>('sport');
  const [selectedSport, setSelectedSport] = useState<typeof SPORTS[0] | null>(null);
  const [selectedSub, setSelectedSub] = useState<typeof SPORTS[0]['subs'][0] | null>(null);
  const [elevationM, setElevationM] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const timeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(e.target as Node)) {
        setShowTimeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const reset = () => {
    setStep('sport');
    setSelectedSport(null);
    setSelectedSub(null);
    setElevationM('');
    setScheduledTime('');
    setShowTimeDropdown(false);
  };

  const handleClose = () => { reset(); onClose(); };

  const handleSportSelect = (sport: typeof SPORTS[0]) => {
    setSelectedSport(sport);
    setStep('sub');
  };

  const handleSubSelect = (sub: typeof SPORTS[0]['subs'][0]) => {
    setSelectedSub(sub);
    if (sub.hasElevation) {
      setStep('details');
    } else {
      setStep('details');
    }
  };

  const handleConfirm = () => {
    if (!selectedSport || !selectedSub) return;
    const opts: { elevationM?: number; scheduledTime?: string } = {};
    if (elevationM && parseInt(elevationM) > 0) opts.elevationM = parseInt(elevationM);
    if (scheduledTime) opts.scheduledTime = scheduledTime;
    onSelect(selectedSport.id, selectedSub.id, opts);
    reset();
  };

  if (!isOpen) return null;

  const dateLabel = selectedDate
    ? selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    : '';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">New Workout</h2>
            {dateLabel && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{dateLabel}</p>}
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {step === 'sport' && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Select Sport</p>
              {SPORTS.map(sport => (
                <button
                  key={sport.id}
                  onClick={() => handleSportSelect(sport)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all hover:scale-[1.01] active:scale-[0.99] group ${sport.bg} ${sport.border} hover:border-opacity-60`}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${sport.accent}22, ${sport.accent}44)`, color: sport.accent }}>
                    {sport.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-gray-900 dark:text-white text-base">{sport.label}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sport.subs.length} modalities</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600 transition" />
                </button>
              ))}
            </div>
          )}

          {step === 'sub' && selectedSport && (
            <div className="space-y-2.5">
              <button
                onClick={() => setStep('sport')}
                className="flex items-center gap-1 text-xs font-semibold mb-3 transition"
                style={{ color: selectedSport.accent }}
              >
                ← {selectedSport.label}
              </button>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                Select Modality
              </p>
              {selectedSport.subs.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => handleSubSelect(sub)}
                  className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl border transition-all hover:scale-[1.01] active:scale-[0.99] group ${selectedSport.bg} ${selectedSport.border}`}
                >
                  <span className="text-2xl flex-shrink-0 w-9 text-center">{sub.icon}</span>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{sub.label}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub.desc}</p>
                  </div>
                  {sub.hasElevation && (
                    <div className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{ background: `${selectedSport.accent}20`, color: selectedSport.accent }}>
                      <Mountain size={9} />
                      Elevation
                    </div>
                  )}
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 transition flex-shrink-0" />
                </button>
              ))}
            </div>
          )}

          {step === 'details' && selectedSport && selectedSub && (
            <div className="space-y-5">
              <button
                onClick={() => setStep('sub')}
                className="flex items-center gap-1 text-xs font-semibold transition"
                style={{ color: selectedSport.accent }}
              >
                ← {selectedSub.label}
              </button>

              <div className={`flex items-center gap-3 p-3.5 rounded-xl border ${selectedSport.bg} ${selectedSport.border}`}>
                <span className="text-2xl">{selectedSub.icon}</span>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{selectedSub.label}</p>
                  <p className="text-xs text-gray-400">{selectedSport.label}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div ref={timeDropdownRef} className="relative">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    <Clock size={12} />
                    Start Time (optional)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowTimeDropdown(v => !v)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none transition"
                  >
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400 flex-shrink-0" />
                      <span className={scheduledTime ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-400'}>
                        {scheduledTime || 'Select time...'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {scheduledTime && (
                        <span
                          onClick={(e) => { e.stopPropagation(); setScheduledTime(''); }}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-0.5 rounded transition cursor-pointer"
                        >
                          <X size={12} />
                        </span>
                      )}
                      <ChevronDown size={14} className={`text-gray-400 transition-transform ${showTimeDropdown ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  {showTimeDropdown && (
                    <div className="absolute z-50 left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden max-h-52 overflow-y-auto">
                      {TIMES.map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => { setScheduledTime(scheduledTime === t ? '' : t); setShowTimeDropdown(false); }}
                          className={`w-full px-4 py-2.5 text-left text-sm border-b border-gray-100 dark:border-gray-700 last:border-0 transition ${
                            scheduledTime === t
                              ? 'font-semibold'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                          style={scheduledTime === t ? { color: selectedSport.accent, background: `${selectedSport.accent}15` } : {}}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {selectedSub.hasElevation && (
                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      <Mountain size={12} />
                      Planned Elevation Gain (optional)
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          value={elevationM}
                          onChange={e => setElevationM(e.target.value)}
                          min="0"
                          max="9000"
                          step="50"
                          placeholder="e.g. 800"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 pr-10"
                          style={{ '--tw-ring-color': selectedSport.accent } as any}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">m</span>
                      </div>
                      <div className="flex gap-1.5">
                        {[200, 500, 1000, 2000].map(v => (
                          <button
                            key={v}
                            onClick={() => setElevationM(String(v))}
                            className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition ${
                              elevationM === String(v)
                                ? 'text-white border-transparent'
                                : 'text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300'
                            }`}
                            style={elevationM === String(v) ? { background: selectedSport.accent, borderColor: selectedSport.accent } : {}}
                          >
                            {v >= 1000 ? `${v / 1000}k` : v}
                          </button>
                        ))}
                      </div>
                    </div>
                    {elevationM && parseInt(elevationM) > 0 && (
                      <p className="text-xs mt-1.5" style={{ color: selectedSport.accent }}>
                        +{parseInt(elevationM).toLocaleString()} m elevation planned
                      </p>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={handleConfirm}
                className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all active:scale-[0.98] mt-2"
                style={{ background: `linear-gradient(135deg, ${selectedSport.accent}, ${selectedSport.accent}cc)` }}
              >
                Build Workout →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
