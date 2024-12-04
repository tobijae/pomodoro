const App = () => {
  const [minutes, setMinutes] = React.useState(25);
  const [seconds, setSeconds] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const [mode, setMode] = React.useState('work');
  const [sound, setSound] = React.useState(true);
  const [progress, setProgress] = React.useState(100);

  React.useEffect(() => {
    const totalSeconds = mode === 'work' ? 25 * 60 : 5 * 60;
    const currentSeconds = minutes * 60 + seconds;
    setProgress((currentSeconds / totalSeconds) * 100);
  }, [minutes, seconds, mode]);

  React.useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          if (sound) {
            const audio = new Audio('/notification.mp3');
            audio.play();
          }
          setIsRunning(false);
          setMode(mode === 'work' ? 'break' : 'work');
          setMinutes(mode === 'work' ? 5 : 25);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds, mode, sound]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(66,0,255,0.15),rgba(0,255,255,0.15))]" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-500 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.3
            }}
          />
        ))}
      </div>

      {/* Main timer container */}
      <div className="relative">
        <div className="w-96 h-96 relative flex items-center justify-center">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-gray-800 animate-pulse" />
          
          {/* Progress ring */}
          <svg className="absolute inset-0 -rotate-90 transform scale-95">
            <circle
              cx="192"
              cy="192"
              r="180"
              stroke={mode === 'work' ? '#0ff' : '#ff00ff'}
              strokeWidth="4"
              fill="none"
              className="transition-all duration-500"
              style={{
                strokeDasharray: `${2 * Math.PI * 180}`,
                strokeDashoffset: `${2 * Math.PI * 180 * (1 - progress / 100)}`,
                filter: 'drop-shadow(0 0 10px currentColor)'
              }}
            />
          </svg>

          {/* Inner content */}
          <div className="relative z-10 text-center">
            <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500">
              CYBER TIMER
            </h1>
            
            {/* Time display */}
            <div className="text-7xl font-bold mb-4 font-mono"
              style={{
                color: mode === 'work' ? '#0ff' : '#ff00ff',
                textShadow: `0 0 20px ${mode === 'work' ? '#0ff' : '#ff00ff'}`
              }}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>

            {/* Mode indicator */}
            <div className="text-xl uppercase tracking-widest mb-8"
              style={{
                color: mode === 'work' ? '#0ff' : '#ff00ff',
                textShadow: `0 0 10px ${mode === 'work' ? '#0ff' : '#ff00ff'}`
              }}>
              {mode} MODE
            </div>

            {/* Controls */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`p-4 rounded-full transition-all duration-300 transform hover:scale-110 ${
                  isRunning 
                    ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' 
                    : 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                }`}
                style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}
              >
                {isRunning ? '⏸️' : '▶️'}
              </button>

              <button
                onClick={() => {
                  setIsRunning(false);
                  setMinutes(mode === 'work' ? 25 : 5);
                  setSeconds(0);
                }}
                className="p-4 rounded-full bg-gray-700/20 text-gray-300 hover:bg-gray-700/30 transition-all duration-300 transform hover:scale-110"
                style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}
              >
                🔄
              </button>

              <button
                onClick={() => {
                  setMode(mode === 'work' ? 'break' : 'work');
                  setMinutes(mode === 'work' ? 5 : 25);
                  setSeconds(0);
                  setIsRunning(false);
                }}
                className="p-4 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all duration-300 transform hover:scale-110"
                style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}
              >
                {mode === 'work' ? '☕' : '💪'}
              </button>

              <button
                onClick={() => setSound(!sound)}
                className="p-4 rounded-full bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-all duration-300 transform hover:scale-110"
                style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}
              >
                {sound ? '🔊' : '🔇'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
