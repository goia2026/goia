export function GoiaLogo({
  compact = false,
  mark = false
}: {
  compact?: boolean;
  mark?: boolean;
}) {
  return (
    <div className="relative flex flex-col items-center gap-2 text-center">
      {mark ? (
        <object
          data="/goia-logo-transparent.png"
          type="image/png"
          aria-label="GOIA Huqqa Lounge"
          className={[
            "object-contain drop-shadow-[0_18px_55px_rgba(0,0,0,0.5)]",
            compact ? "h-12 w-28" : "h-28 w-72 sm:h-36 sm:w-96"
          ].join(" ")}
        >
          <LogoText compact={compact} />
        </object>
      ) : (
        <LogoText compact={compact} />
      )}
    </div>
  );
}

function LogoText({ compact = false }: { compact?: boolean }) {
  return (
    <div>
        <div
          className={[
            "font-semibold tracking-[0.32em] text-porcelain",
            compact ? "text-xl" : "text-5xl sm:text-7xl"
          ].join(" ")}
        >
          GOIA
        </div>
        <div className={compact ? "mx-auto mt-2 h-px w-16 fine-line" : "mx-auto mt-3 h-px w-32 fine-line"} />
        <div
          className={[
            "mt-2 font-light uppercase tracking-[0.42em] text-porcelain/68",
            compact ? "text-[0.56rem]" : "text-xs sm:text-sm"
          ].join(" ")}
        >
          Huqqa Lounge
        </div>
      </div>
  );
}
