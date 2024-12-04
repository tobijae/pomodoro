const App = () => {
  const [minutes, setMinutes] = React.useState(25);
  const [seconds, setSeconds] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const [mode, setMode] = React.useState('work');
  const [progress, setProgress] = React.useState(100);

  // Calculate progress
  React.useEffect(() => {
    const totalSeconds = mode === 'work' ? 25 * 60 : 5 * 60;
    const currentSeconds = minutes * 60 + seconds;
    setProgress((currentSeconds / totalSeconds) * 100);
  }, [minutes, seconds, mode]);

  // Timer logic
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
          setIsRunning(false);
          setMode(mode === 'work' ? 'break' : 'work');
          setMinutes(mode === 'work' ? 5 : 25);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds, mode]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-cyan-900/20" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: 0.2
            }}
          />
        ))}
      </div>

      {/* Main container */}
      <div className="relative bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-700">
        {/* Timer display */}
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8 text-center">
          CYBER TIMER
        </h1>

        <div className="text-8xl font-bold mb-4 text-center font-mono"
          style={{
            color: mode === 'work' ? '#0ff' : '#ff00ff',
            textShadow: `0 0 20px ${mode === 'work' ? '#0ff' : '#ff00ff'}`
          }}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="text-xl uppercase text-center mb-8 tracking-widest"
          style={{
            color: mode === 'work' ? '#0ff' : '#ff00ff',
            textShadow: `0 0 10px ${mode === 'work' ? '#0ff' : '#ff00ff'}`
          }}>
          {mode} MODE
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-700 rounded-full mb-8 overflow-hidden">
          <div 
            className="h-full transition-all duration-300"
            style={{ 
              width: `${progress}%`,
              backgroundColor: mode === 'work' ? '#0ff' : '#ff00ff',
              boxShadow: `0 0 10px ${mode === 'work' ? '#0ff' : '#ff00ff'}`
            }}
          />
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-110 ${
              isRunning 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
            }`}
            style={{ textShadow: '0 0 10px currentColor' }}
          >
            {isRunning ? 'PAUSE' : 'START'}
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setMinutes(mode === 'work' ? 25 : 5);
              setSeconds(0);
            }}
            className="px-6 py-3 rounded-lg bg-gray-600/20 text-gray-300 hover:bg-gray-600/30 transition-all duration-300 transform hover:scale-110"
          >
            RESET
          </button>

          <button
            onClick={() => {
              setMode(mode === 'work' ? 'break' : 'work');
              setMinutes(mode === 'work' ? 5 : 25);
              setSeconds(0);
              setIsRunning(false);
            }}
            className="px-6 py-3 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all duration-300 transform hover:scale-110"
            style={{ textShadow: '0 0 10px currentColor' }}
          >
            SWITCH
          </button>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
