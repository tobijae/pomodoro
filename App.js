const TimerWidget = ({ id, minutes, seconds, mode, isRunning, onStart, onReset, onSwitch }) => {
  const [title, setTitle] = React.useState('CYBER TIMER');
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [isEditingTime, setIsEditingTime] = React.useState(false);
  const [customMinutes, setCustomMinutes] = React.useState(minutes);

  const handleTimeSubmit = (e) => {
    e.preventDefault();
    onReset(parseInt(customMinutes));
    setIsEditingTime(false);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 shadow-lg border border-gray-700 widget">
      <h1 
        className="text-4xl font-bold text-cyan-400 text-center mb-8 glow cursor-pointer"
        onClick={() => setIsEditingTitle(true)}
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
        className="text-8xl font-bold text-center mb-4 font-mono text-cyan-400 glow cursor-pointer"
        onClick={() => !isRunning && setIsEditingTime(true)}
      >
        {isEditingTime ? (
          <form onSubmit={handleTimeSubmit}>
            <input
              type="number"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(e.target.value)}
              onBlur={handleTimeSubmit}
              autoFocus
              className="bg-transparent border-b border-cyan-400 outline-none w-32 text-center"
            />
          </form>
        ) : (
          `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        )}
      </div>

      <div className="text-xl text-cyan-400 text-center mb-8 uppercase tracking-widest">
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
          className="px-6 py-2 rounded bg-blue-500/20 text-blue-400"
        >
          SWITCH
        </button>
      </div>
    </div>
  );
};

const TasksWidget = ({ id, tasks, taskProgress, newTask, onNewTaskChange, onAddTask, onToggleTask, onRemoveTask }) => {
  const [title, setTitle] = React.useState('TASKS');
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);

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
            width: `${taskProgress}%`,
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
  // Widget management with unique IDs
  const [widgets, setWidgets] = React.useState([{ type: 'timer', id: 'timer-1' }]);
  const [showWidgetMenu, setShowWidgetMenu] = React.useState(false);
  const [menuPosition, setMenuPosition] = React.useState({ x: 0, y: 0 });

  // Timer state
  const [minutes, setMinutes] = React.useState(25);
  const [seconds, setSeconds] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const [mode, setMode] = React.useState('work');

  // Tasks state management for multiple task widgets
  const [taskWidgets, setTaskWidgets] = React.useState({});

  // Timer logic remains the same
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
      setTaskWidgets({
        ...taskWidgets,
        [newId]: {
          tasks: [],
          newTask: '',
          taskProgress: 0
        }
      });
    }
    setShowWidgetMenu(false);
  };

  const removeWidget = (widgetId) => {
    setWidgets(widgets.filter(w => w.id !== widgetId));
    if (widgetId.startsWith('tasks-')) {
      const newTaskWidgets = { ...taskWidgets };
      delete newTaskWidgets[widgetId];
      setTaskWidgets(newTaskWidgets);
    }
  };

  const handleAddTask = (widgetId) => (e) => {
    e.preventDefault();
    const widget = taskWidgets[widgetId];
    if (widget.newTask.trim()) {
      const newTasks = [
        ...widget.tasks,
        { id: Date.now(), text: widget.newTask, completed: false }
      ];
      setTaskWidgets({
        ...taskWidgets,
        [widgetId]: {
          ...widget,
          tasks: newTasks,
          newTask: '',
          taskProgress: (newTasks.filter(t => t.completed).length / newTasks.length) * 100
        }
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
                taskProgress={taskWidgets[widget.id].taskProgress}
                newTask={taskWidgets[widget.id].newTask}
                onNewTaskChange={(e) => setTaskWidgets({
                  ...taskWidgets,
                  [widget.id]: {
                    ...taskWidgets[widget.id],
                    newTask: e.target.value
                  }
                })}
                onAddTask={handleAddTask(widget.id)}
                onToggleTask={(taskId) => {
                  const widget = taskWidgets[widget.id];
                  const newTasks = widget.tasks.map(task =>
                    task.id === taskId ? { ...task, completed: !task.completed } : task
                  );
                  setTaskWidgets({
                    ...taskWidgets,
                    [widget.id]: {
                      ...widget,
                      tasks: newTasks,
                      taskProgress: (newTasks.filter(t => t.completed).length / newTasks.length) * 100
                    }
                  });
                }}
                onRemoveTask={(taskId) => {
                  const widget = taskWidgets[widget.id];
                  const newTasks = widget.tasks.filter(task => task.id !== taskId);
                  setTaskWidgets({
                    ...taskWidgets,
                    [widget.id]: {
                      ...widget,
                      tasks: newTasks,
                      taskProgress: newTasks.length ? (newTasks.filter(t => t.completed).length / newTasks.length) * 100 : 0
                    }
                  });
                }}
              />
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
          </div>
        )}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
