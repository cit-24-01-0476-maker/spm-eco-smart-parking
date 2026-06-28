export function LoadingScreen() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-navy-deep">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-cyan-glow border-t-transparent" />
        <div className="mt-4 text-xs uppercase tracking-[0.4em] text-cyan-glow">
          Loading 3D environment…
        </div>
      </div>
    </div>
  );
}
