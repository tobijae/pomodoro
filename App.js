const App = () => {
  const [minutes, setMinutes] = React.useState(25);
  const [seconds, setSeconds] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const [mode, setMode] = React.useState('work');
  const [tasks, setTasks] = React.useState([]);
  const [newTask, setNewTask] = React.useState('');
  const [taskProgress, setTaskProgress] = React.useState(0);

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

  // Calculate task progress
  React.useEffect(() => {
    if (tasks.length === 0) {
      setTaskProgress(0);
    } else {
      const completed = tasks.filter(task => task.completed).length;
      setTaskProgress((completed / tasks.length) * 100);
    }
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const removeTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center gap-8 p-8">
      {/* Timer Section */}
      <div className="bg-gray-800/50 backdrop-blur rounded-xl p-8 shadow-lg border border-gray-700">
        <h1 className="text-4xl font-bold text-cyan-400 text-center mb-8">CYBER TIMER</h1>
        
        <div className="text-8xl font-bold text-center mb-4 font-mono text-cyan-400" 
          style={{ textShadow: '0 0 20px #0ff' }}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="text-xl text-cyan-400 text-center mb-8">{mode.toUpperCase()} MODE</div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-6 py-2 rounded ${
              isRunning ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
            }`}
          >
            {isRunning ? 'PAUSE' : 'START'}
          </button>
          <button
            onClick={() => {
              setIsRunning(false);
              setMinutes(mode === 'work' ? 25 : 5);
              setSeconds(0);
            }}
            className="px-6 py-2 rounded bg-gray-700/50 text-gray-300"
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
            className="px-6 py-2 rounded bg-blue-500/20 text-blue-400"
          >
            SWITCH
          </button>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="bg-gray-800/50 backdrop-blur rounded-xl p-8 shadow-lg border border-gray-700 w-96">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">TASKS</h2>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-700 rounded-full mb-6">
          <div 
            className="h-full bg-cyan-400 rounded-full transition-all duration-300"
            style={{ 
              width: `${taskProgress}%`,
              boxShadow: '0 0 10px #0ff'
            }}
          />
        </div>

        {/* Add Task Form */}
        <form onSubmit={addTask} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 bg-gray-700/50 border border-gray-600 rounded px-4 py-2 text-cyan-400 placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30"
            >
              ADD
            </button>
          </div>
        </form>

        {/* Task List */}
        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center gap-3 bg-gray-700/30 rounded p-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="w-4 h-4 rounded border-gray-600 text-cyan-400 focus:ring-cyan-400"
              />
              <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-cyan-400'}`}>
                {task.text}
              </span>
              <button
                onClick={() => removeTask(task.id)}
                className="text-gray-500 hover:text-red-400"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Task Stats */}
        <div className="mt-4 text-sm text-gray-500">
          Completed: {tasks.filter(t => t.completed).length} / {tasks.length}
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
