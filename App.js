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
          setIsRunning(false);
          setMode(mode === 'work' ? 'break' : 'work');
          setMinutes(mode === 'work' ? 5 : 25);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds, mode]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-white">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Pomodoro Timer
        </h1>
        <div className="text-6xl font-bold mb-8 text-center">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <div className="text-center mb-4">
          <div className="text-xl text-cyan-400">
            {mode.toUpperCase()} MODE
          </div>
          <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
            <div
              className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-6 py-2 rounded-lg ${
              isRunning
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={() => {
              setIsRunning(false);
              setMinutes(mode === 'work' ? 25 : 5);
              setSeconds(0);
            }}
            className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-700"
          >
            Reset
          </button>
          <button
            onClick={() => {
              setMode(mode === 'work' ? 'break' : 'work');
              setMinutes(mode === 'work' ? 5 : 25);
              setSeconds(0);
              setIsRunning(false);
            }}
            className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600"
          >
            Switch Mode
          </button>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
