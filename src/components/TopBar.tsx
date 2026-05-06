export default function TopBar() {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b-2 border-primary-yellow z-50 h-16 flex items-center px-6">
      <div className="flex items-center gap-3">
        <img src="/favicon_fondo_blanco.png" alt="Asciende" className="h-8 w-8 object-contain" />
        <div>
          <h1 className="text-lg font-heading font-bold text-primary-purple dark:text-white">
            Asciende Endurance Planner
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-400 font-body -mt-0.5">
            Training Planning & Performance Analytics
          </p>
        </div>
      </div>
    </div>
  );
}
