const Header = () => {
  const img = ["/assets/l.png"];

  return (
    <header className="fixed left-0 top-0 z-50 h-[76px] w-full bg-[#FFFBEB] border-b border-slate-200 shadow-sm">
      <div className="flex h-full items-center justify-between px-5 sm:px-6">

        {/* =====================================================
            BRAND
        ====================================================== */}
        <div className="flex shrink-0 items-center">

          {/* Logo */}
          <div className="flex h-12 w-12 items-center justify-center">
            <img
              src={img}
              alt="BOHECO II"
              className="h-12 w-12 object-contain"
            />
          </div>

          {/* Divider */}
          <div className="mx-4 h-10 w-[2px] rounded-full bg-yellow-500" />

          {/* Brand Text */}
          <div className="leading-none">
            <h1 className="text-[15px] font-extrabold tracking-wide text-slate-900">
              BOHECO II
            </h1>

            <p className="mt-1 text-[9px] font-semibold tracking-[0.22em] text-emerald-700">
              SERVICES
            </p>
          </div>

        </div>


        {/* =====================================================
            RIGHT SIDE DECORATION
        ====================================================== */}
        <div className="flex items-center gap-2">

          <span className="h-2 w-2 rounded-full bg-emerald-600" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-2 w-2 rounded-full bg-emerald-300" />

        </div>

      </div>
    </header>
  );
};

export default Header;