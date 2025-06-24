
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const initialTimeSlots = [
  "5:00 AM","6:00 AM","7:00 AM","8:00 AM","9:00 AM","10:00 AM",
  "11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM",
  "5:00 PM","6:00 PM","7:00 PM","8:00 PM","9:00 PM","10:00 PM","11:00 PM"
];

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [tasks, setTasks] = useState({});
  const [taskInput, setTaskInput] = useState("");
  const [duration, setDuration] = useState("30");
  const [selectedTask, setSelectedTask] = useState(null);

  const handleAddTask = () => {
    if (!taskInput.trim()) return;
    const id = uuidv4();
    const color = "bg-blue-600";
    setTasks((prev) => ({
      ...prev,
      unscheduled: [...(prev.unscheduled || []), { id, content: taskInput, color, duration: parseInt(duration) }]
    }));
    setTaskInput("");
  };

  const handleTaskTap = (task, fromSlot) => setSelectedTask({ ...task, fromSlot });

  const handleSlotTap = (slot) => {
    if (!selectedTask) return;
    const { fromSlot, ...task } = selectedTask;
    const destCol = tasks[slot] || [];
    const totalDuration = destCol.reduce((sum, t) => sum + parseInt(t.duration), 0);
    if (slot !== "unscheduled" && totalDuration + parseInt(task.duration) > 60) return;

    const fromCol = tasks[fromSlot] || [];
    const updatedFrom = fromCol.filter((t) => t.id !== task.id);
    const updatedTo = [...destCol, task];

    setTasks({
      ...tasks,
      [fromSlot]: updatedFrom,
      [slot]: updatedTo
    });
    setSelectedTask(null);
  };

  const getOverlayStyle = (duration) => {
    const widthMap = { 15: "25%", 30: "50%", 45: "75%", 60: "100%" };
    return { width: widthMap[duration] || "25%" };
  };

  const getCardStyle = (task) => ({
    width: getOverlayStyle(task.duration).width,
    border: selectedTask?.id === task.id ? (darkMode ? '2px solid white' : '2px solid black') : 'none'
  });

  return (
    <div className={`p-4 min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-4">
        <h1 className="text-3xl font-bold">Timebox Your Day</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input className="bg-white text-black h-10 px-2" placeholder="Add a task..." value={taskInput} onChange={(e) => setTaskInput(e.target.value)} />
          <select value={duration} onChange={(e) => setDuration(e.target.value)} className="bg-white text-black h-10 px-2">
            {[15, 30, 45, 60].map((val) => <option key={val} value={val}>{val} min</option>)}
          </select>
          <button onClick={handleAddTask} className="h-10 px-4 bg-blue-600 text-white">Add</button>
          <button onClick={() => setTasks({})} className="h-10 px-4 bg-red-600 text-white">Clear</button>
        </div>
        <button onClick={() => setDarkMode(!darkMode)} className="h-10 px-4 border">{darkMode ? 'Light Mode' : 'Dark Mode'}</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {["unscheduled", ...initialTimeSlots].map((slot) => (
          <div key={slot} onClick={() => handleSlotTap(slot)} className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'} p-2 rounded-xl min-h-[150px']`}>
            <h2 className="text-base font-medium mb-1 px-1 rounded bg-blue-200 text-black">{slot === "unscheduled" ? "Unscheduled" : slot}</h2>
            {(tasks[slot] || []).map((task) => (
              <div key={task.id} onClick={(e) => { e.stopPropagation(); handleTaskTap(task, slot); }} className={`mb-2 relative rounded overflow-hidden ${task.color}`} style={getCardStyle(task)}>
                <div className={`absolute top-0 left-0 h-full ${task.color}`} style={getOverlayStyle(task.duration)}></div>
                <div className={`p-2 text-sm relative z-10 text-white`}>
                  <div>{task.content} ({task.duration} min)</div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
