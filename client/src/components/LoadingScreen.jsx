const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">QuizMaker</h2>
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;