const App = () => {
  const [minutes, setMinutes] = React.useState(25);
  const [seconds, setSeconds] = React.useState(0);
  const [milliseconds, setMilliseconds] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const [mode, setMode] = React.useState('work');
  const [progress, setProgress] = React.useState(100);
  const [customBackground, setCustomBackground] = React.useState(null);

  // Smooth progress calculation
  React.useEffect(() => {
    const totalMs = (mode === 'work' ? 25 : 5) * 60 * 1000;
    const currentMs = (minutes * 60 + seconds) * 1000 + milliseconds;
    setProgress((currentMs / totalMs) * 100);
  }, [minutes, seconds, milliseconds, mode]);

  // Enhanced timer logic with milliseconds
  React.useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setMilliseconds(prev => {
          if (prev <= 0) {
            if (seconds <= 0) {
              if (minutes <= 0) {
                setIsRunning(false);
                setMode(mode === 'work' ? 'break' : 'work');
                setMinutes(mode === 'work' ? 5 : 25);
                setSeconds(0);
                return 999;
              }
              setMinutes(prev => prev - 1);
              setSeconds(59);
              return 999;
            }
            setSeconds(prev => prev - 1);
            return 999;
          }
          return prev - 100;
        });
      }, 20); // Update every 100ms for smoother animation
    }
    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds, mode]);

  // Background image handler
  const handleBackgroundUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomBackground(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative">
      {/* Custom background */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{
          backgroundColor: '#1a1a2e',
          backgroundImage: customBackground ? `url(${customBackground})` : 'none',
          backgroundBlendMode: 'overlay',
        }}
      >
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a1a2e]/70 to-[#1a1a2e]" />
      </div>

      {/* Sand particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-orange-300/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `scale(${Math.random() * 3})`,
              animation: `float ${10 + Math.random() * 20}s linear infinite`,
              opacity: Math.random() * 0.5,
            }}
          />
        ))}
      </div>

      {/* Main container */}
      <div className="relative backdrop-blur-sm bg-black/20 rounded-lg p-12 max-w-lg w-full mx-4">
        {/* Timer display */}
        <div className="text-8xl font-serif mb-8 text-center tracking-widest"
          style={{
            color: mode === 'work' ? '#e6b17e' : '#d4a373',
            textShadow: '0 0 30px rgba(230, 177, 126, 0.3)',
            fontFamily: 'serif'
          }}>
          {String(minutes).padStart(2, '0')}
          <span className="opacity-50">:</span>
          {String(seconds).padStart(2, '0')}
        </div>

        <div 
          className="text-xl uppercase text-center mb-12 tracking-[0.3em] font-thin"
          style={{
            color: mode === 'work' ? '#e6b17e' : '#d4a373',
          }}>
          {mode} MODE
        </div>

        {/* Progress ring */}
        <div className="relative h-1 mb-12 overflow-hidden rounded-full bg-gray-800/50">
          <div
            className="absolute h-full transition-all duration-100 rounded-full"
            style={{
              width: `${progress}%`,
              backgroundColor: mode === 'work' ? '#e6b17e' : '#d4a373',
              boxShadow: `0 0 20px ${mode === 'work' ? '#e6b17e' : '#d4a373'}`,
            }}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-8 py-3 rounded border-2 transition-all duration-300 hover:bg-white/5"
            style={{
              borderColor: mode === 'work' ? '#e6b17e' : '#d4a373',
              color: mode === 'work' ? '#e6b17e' : '#d4a373',
            }}
          >
            {isRunning ? 'PAUSE' : 'START'}
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setMinutes(mode === 'work' ? 25 : 5);
              setSeconds(0);
              setMilliseconds(0);
            }}
            className="px-8 py-3 rounded border-2 border-gray-600 text-gray-400 transition-all duration-300 hover:bg-white/5"
          >
            RESET
          </button>

          <button
            onClick={() => {
              setMode(mode === 'work' ? 'break' : 'work');
              setMinutes(mode === 'work' ? 5 : 25);
              setSeconds(0);
              setMilliseconds(0);
              setIsRunning(false);
            }}
            className="px-8 py-3 rounded border-2 transition-all duration-300 hover:bg-white/5"
            style={{
              borderColor: mode === 'work' ? '#d4a373' : '#e6b17e',
              color: mode === 'work' ? '#d4a373' : '#e6b17e',
            }}
          >
            SWITCH
          </button>
        </div>

        {/* Background upload */}
        <div className="absolute bottom-4 right-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleBackgroundUpload}
            className="hidden"
            id="background-upload"
          />
          <label
            htmlFor="background-upload"
            className="cursor-pointer text-sm text-gray-400 hover:text-gray-300 transition-colors duration-300"
          >
            Change Background
          </label>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
