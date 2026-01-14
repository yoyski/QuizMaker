const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 pointer-events-none">
      {/* Loading bar at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 overflow-hidden">
        <div className="h-full bg-blue-500 animate-[loading_1s_ease-in-out_infinite]"></div>
      </div>
    </div>
  );
};

export default LoadingOverlay;