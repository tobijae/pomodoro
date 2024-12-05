const TimerWidget = ({ id, minutes, seconds, mode, isRunning, onStart, onReset, onSwitch }) => {
  const modeColors = {
    work: { text: 'text-cyan-400', glow: '#0ff', bg: 'bg-gray-800/50' },
    break: { text: 'text-purple-400', glow: '#a855f7', bg: 'bg-gray-700/50' }
  };

  const [title, setTitle] = React.useState('CYBER TIMER');
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [isEditingTime, setIsEditingTime] = React.useState(false);

  const adjustTime = (amount, e) => {
    e.stopPropagation();
    const newMinutes = Math.min(Math.max(1, minutes + amount), 99);
    onReset(newMinutes);
  };

  return (
    <div className={`${modeColors[mode].bg} backdrop-blur-md rounded-xl p-8 shadow-lg border border-gray-700 widget transition-all duration-300`}>
      <h1 
        className={`text-4xl font-bold ${modeColors[mode].text} text-center mb-8 glow cursor-pointer transition-all duration-300`}
        onClick={() => setIsEditingTitle(true)}
        style={{ textShadow: `0 0 20px ${modeColors[mode].glow}` }}
      >
        {isEditingTitle ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            autoFocus
            className="bg-transparent border-b border-cyan-400 outline-none w-full text-center"
          />
        ) : title}
      </h1>
      
      <div 
        className={`text-8xl font-bold text-center mb-4 font-mono ${modeColors[mode].text} glow transition-all duration-300`}
        onClick={() => !isRunning && setIsEditingTime(!isEditingTime)}
        style={{ textShadow: `0 0 20px ${modeColors[mode].glow}` }}
      >
        {isEditingTime ? (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={(e) => adjustTime(-1, e)}
              className={`${modeColors[mode].text} text-4xl hover:opacity-80 px-4 py-2 rounded bg-gray-700/30`}
            >
              -
            </button>
            <span>{String(minutes).padStart(2, '0')}:00</span>
            <button
              onClick={(e) => adjustTime(1, e)}
              className={`${modeColors[mode].text} text-4xl hover:opacity-80 px-4 py-2 rounded bg-gray-700/30`}
            >
              +
            </button>
          </div>
        ) : (
          `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        )}
      </div>

      <div className={`text-xl ${modeColors[mode].text} text-center mb-8 uppercase tracking-widest transition-all duration-300`}>
        {mode} MODE
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={onStart}
          className={`px-6 py-2 rounded transition-colors ${
            isRunning ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
          }`}
        >
          {isRunning ? 'PAUSE' : 'START'}
        </button>
        <button
          onClick={() => onReset(25)}
          className="px-6 py-2 rounded bg-gray-700/50 text-gray-300"
        >
          RESET
        </button>
        <button
          onClick={onSwitch}
          className={`px-6 py-2 rounded bg-${mode === 'work' ? 'purple' : 'cyan'}-500/20 text-${mode === 'work' ? 'purple' : 'cyan'}-400`}
        >
          SWITCH
        </button>
      </div>
    </div>
  );
};

const HabitsWidget = ({ id }) => {
  const [title, setTitle] = React.useState('HABITS');
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [habits, setHabits] = React.useState([]);
  const [newHabit, setNewHabit] = React.useState('');

  const days = React.useMemo(() => {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      result.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' })
      });
    }
    return result;
  }, []);

  const toggleHabitDay = (habitId, date) => {
    setHabits(prevHabits => prevHabits.map(habit => {
      if (habit.id === habitId) {
        const newDates = new Set(habit.completedDates);
        if (newDates.has(date)) {
          newDates.delete(date);
        } else {
          newDates.add(date);
        }
        return { ...habit, completedDates: Array.from(newDates) };
      }
      return habit;
    }));
  };

  const addHabit = (e) => {
    e.preventDefault();
    if (newHabit.trim()) {
      setHabits(prev => [...prev, {
        id: Date.now(),
        name: newHabit,
        completedDates: []
      }]);
      setNewHabit('');
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 shadow-lg border border-gray-700 w-96">
      <h2 
        className="text-2xl font-bold text-cyan-400 mb-4 glow cursor-pointer"
        onClick={() => setIsEditingTitle(true)}
      >
        {isEditingTitle ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            autoFocus
            className="bg-transparent border-b border-cyan-400 outline-none w-full"
          />
        ) : title}
      </h2>

      <form onSubmit={addHabit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Add a new habit..."
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

      <div className="grid grid-cols-8 gap-1 mb-4">
        <div className="text-gray-500 text-xs"></div>
        {days.map(({ dayName }) => (
          <div key={dayName} className="text-gray-500 text-xs text-center">
            {dayName}
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {habits.map(habit => (
          <div key={habit.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-cyan-400">{habit.name}</span>
              <button
                onClick={() => setHabits(prev => prev.filter(h => h.id !== habit.id))}
                className="text-gray-500 hover:text-red-400"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-8 gap-1">
              <div className="text-gray-500 text-xs flex items-center">{habit.completedDates.length}</div>
              {days.map(({ date }) => (
                <button
                  key={date}
                  onClick={() => toggleHabitDay(habit.id, date)}
                  className={`w-8 h-8 rounded ${
                    habit.completedDates.includes(date)
                      ? 'bg-cyan-500/50 border-cyan-400'
                      : 'bg-gray-700/30 border-gray-600'
                  } border hover:border-cyan-400 transition-colors`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
// Firebase configuration
const firebaseConfig = {
  // You'll need to replace these with your Firebase config values
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const TasksWidget = ({ id, tasks, newTask, onNewTaskChange, onAddTask, onToggleTask, onRemoveTask }) => {
  const [title, setTitle] = React.useState('TASKS');
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  
  const progress = React.useMemo(() => {
    if (!tasks.length) return 0;
    const completedTasks = tasks.filter(t => t.completed).length;
    return (completedTasks / tasks.length) * 100;
  }, [tasks]);

  return (
    <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 shadow-lg border border-gray-700 w-96 widget">
      <h2 
        className="text-2xl font-bold text-cyan-400 mb-4 glow cursor-pointer"
        onClick={() => setIsEditingTitle(true)}
      >
        {isEditingTitle ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            autoFocus
            className="bg-transparent border-b border-cyan-400 outline-none w-full"
          />
        ) : title}
      </h2>
      
      <div className="w-full h-2 bg-gray-700 rounded-full mb-6">
        <div 
          className="h-full bg-cyan-400 rounded-full transition-all duration-300"
          style={{ 
            width: `${progress}%`,
            boxShadow: '0 0 10px #0ff'
          }}
        />
      </div>

      <form onSubmit={onAddTask} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={onNewTaskChange}
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

      <div className="space-y-3">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center gap-3 bg-gray-700/30 rounded p-3">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleTask(task.id)}
              className="w-4 h-4 rounded border-gray-600 text-cyan-400 focus:ring-cyan-400"
            />
            <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-cyan-400'}`}>
              {task.text}
            </span>
            <button
              onClick={() => onRemoveTask(task.id)}
              className="text-gray-500 hover:text-red-400"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Completed: {tasks.filter(t => t.completed).length} / {tasks.length}
      </div>
    </div>
  );
};
const App = () => {
  // Auth state
  const [user, setUser] = React.useState(null);
  
  // Widget management
  const [widgets, setWidgets] = React.useState([{ type: 'timer', id: 'timer-1' }]);
  const [showWidgetMenu, setShowWidgetMenu] = React.useState(false);
  const [menuPosition, setMenuPosition] = React.useState({ x: 0, y: 0 });

  // Timer state
  const [minutes, setMinutes] = React.useState(25);
  const [seconds, setSeconds] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const [mode, setMode] = React.useState('work');

  // Tasks state
  const [taskWidgets, setTaskWidgets] = React.useState({});

  // Auth listener
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

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

  const handleAddWidgetClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    setMenuPosition({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY
    });
    setShowWidgetMenu(!showWidgetMenu);
  };

  const addWidget = (type) => {
    const newId = `${type}-${Date.now()}`;
    setWidgets([...widgets, { type, id: newId }]);
    if (type === 'tasks') {
      setTaskWidgets(prev => ({
        ...prev,
        [newId]: {
          tasks: [],
          newTask: ''
        }
      }));
    }
    setShowWidgetMenu(false);
  };

  const removeWidget = (widgetId) => {
    setWidgets(widgets.filter(w => w.id !== widgetId));
    if (widgetId.startsWith('tasks-')) {
      setTaskWidgets(prev => {
        const newState = { ...prev };
        delete newState[widgetId];
        return newState;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden">
      {/* Particles */}
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="particle bg-cyan-500 rounded-full"
          style={{
            width: Math.random() * 3 + 'px',
            height: Math.random() * 3 + 'px',
            left: Math.random() * 100 + 'vw',
            animationDuration: `${20 + Math.random() * 20}s`,
            animationDelay: `${-Math.random() * 40}s`,
            opacity: Math.random() * 0.3,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
            animationName: 'float'
          }}
        />
      ))}

      {/* Widgets Container */}
      <div className="flex flex-wrap gap-8 p-8 items-start">
        {widgets.map(widget => (
          <div key={widget.id} className="relative">
            {widget.id !== 'timer-1' && (
              <button
                onClick={() => removeWidget(widget.id)}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center z-10 hover:bg-red-500/30"
              >
                ×
              </button>
            )}
            
            {widget.type === 'timer' && (
              <TimerWidget
                id={widget.id}
                minutes={minutes}
                seconds={seconds}
                mode={mode}
                isRunning={isRunning}
                onStart={() => setIsRunning(!isRunning)}
                onReset={(newMinutes) => {
                  setIsRunning(false);
                  setMinutes(newMinutes);
                  setSeconds(0);
                }}
                onSwitch={() => {
                  setMode(mode === 'work' ? 'break' : 'work');
                  setMinutes(mode === 'work' ? 5 : 25);
                  setSeconds(0);
                  setIsRunning(false);
                }}
              />
            )}
            
            {widget.type === 'tasks' && taskWidgets[widget.id] && (
              <TasksWidget
                id={widget.id}
                tasks={taskWidgets[widget.id].tasks}
                newTask={taskWidgets[widget.id].newTask}
                onNewTaskChange={(e) => setTaskWidgets(prev => ({
                  ...prev,
                  [widget.id]: {
                    ...prev[widget.id],
                    newTask: e.target.value
                  }
                }))}
                onAddTask={(e) => {
                  e.preventDefault();
                  const widget = taskWidgets[widget.id];
                  if (widget.newTask.trim()) {
                    setTaskWidgets(prev => ({
                      ...prev,
                      [widget.id]: {
                        ...prev[widget.id],
                        tasks: [
                          ...prev[widget.id].tasks,
                          { id: Date.now(), text: widget.newTask, completed: false }
                        ],
                        newTask: ''
                      }
                    }));
                  }
                }}
                onToggleTask={(taskId) => {
                  setTaskWidgets(prev => ({
                    ...prev,
                    [widget.id]: {
                      ...prev[widget.id],
                      tasks: prev[widget.id].tasks.map(task =>
                        task.id === taskId ? { ...task, completed: !task.completed } : task
                      )
                    }
                  }));
                }}
                onRemoveTask={(taskId) => {
                  setTaskWidgets(prev => ({
                    ...prev,
                    [widget.id]: {
                      ...prev[widget.id],
                      tasks: prev[widget.id].tasks.filter(task => task.id !== taskId)
                    }
                  }));
                }}
              />
            )}

            {widget.type === 'habits' && (
              <HabitsWidget id={widget.id} />
            )}
          </div>
        ))}

        {/* Add Widget Button */}
        <button
          onClick={handleAddWidgetClick}
          className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 text-3xl flex items-center justify-center hover:bg-cyan-500/30 transition-all duration-300"
        >
          +
        </button>

        {/* Widget Menu */}
        {showWidgetMenu && (
          <div 
            className="fixed bg-gray-800/90 backdrop-blur rounded-lg p-4 border border-gray-700 shadow-xl z-50"
            style={{
              left: `${menuPosition.x}px`,
              top: `${menuPosition.y}px`,
              transform: 'translate(-50%, -100%)',
              marginTop: '-10px'
            }}
          >
            <button
              onClick={() => addWidget('tasks')}
              className="block w-full px-4 py-2 text-cyan-400 hover:bg-cyan-500/20 rounded text-left"
            >
              Add Tasks Widget
            </button>
            <button
              onClick={() => addWidget('habits')}
              className="block w-full px-4 py-2 text-cyan-400 hover:bg-cyan-500/20 rounded text-left"
            >
              Add Habits Widget
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
