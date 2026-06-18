const SpotifyWidget = () => {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-600/20 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🎵</span>
          </div>
          <div>
            <p className="text-sm text-gray-400">Currently Playing</p>
            <p className="font-bold">Not playing</p>
            <p className="text-sm text-gray-500">Spotify</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default SpotifyWidget;