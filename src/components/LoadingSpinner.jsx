const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mb-2"></div>
        <div className="text-gold">Loading...</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;