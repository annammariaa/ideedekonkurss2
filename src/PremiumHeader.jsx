export default function PremiumHeader({ active = "Eelised" }) {
  const linkBase =
    "px-2 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors";
  const isActive = (label) =>
    label === active
      ? "relative text-slate-900 after:absolute after:left-1 after:right-1 after:-bottom-[6px] after:h-[2px] after:bg-slate-300"
      : "";

  const links = ["Eelised", "Premium kaart", "Hinnakiri", "Dokumendid", "KKK"];

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-200">
      <div className="mx-auto px-5 md:px-6">
        <div className="h-16 md:h-16 flex items-center justify-between">
          {/* vasakul logo/pealkiri */}
          <div className="text-xl md:text-3xl font-extralight tracking-tight ml-8">
            Premium
          </div>

          {/* paremal nav + nupp */}
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-4">
              {links.map((label, i) => (
                <div key={label} className="flex items-center">
                  <a href="#" className={`${linkBase} ${isActive(label)}`}>
                    {label}
                  </a>
                </div>
              ))}
            </nav>

            <button className="rounded-md bg-slate-800 text-white px-3 md:px-4 py-2 text-s md:text-sm shadow-sm hover:shadow-md">
              Sõlmi Premium leping
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
