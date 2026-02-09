import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import { LogOut, Layout, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');
    const [completingTasks, setCompletingTasks] = useState([]);

    useEffect(() => {
        fetchTasks();
    }, [user]);

    const fetchTasks = () => {
        const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const userTasks = allTasks.filter(t => t.user_id === user.id);
        userTasks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setTasks(userTasks);
        setLoading(false);
    };

    const addTask = (taskData) => {
        const newTask = {
            id: Date.now(),
            user_id: user.id,
            ...taskData,
            status: 'pending',
            created_at: new Date().toISOString()
        };

        const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        allTasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(allTasks));

        setTasks([newTask, ...tasks]);
    };

    const updateTask = (id, updates) => {
        // If marking as completed, handle the delay
        if (updates.status === 'completed') {
            setCompletingTasks(prev => [...prev, id]);

            // Wait 5 seconds before actually moving it to completed list
            setTimeout(() => {
                performUpdate(id, updates);
                setCompletingTasks(prev => prev.filter(taskId => taskId !== id));
            }, 5000);
        } else {
            // Immediate update for other changes (like un-completing)
            performUpdate(id, updates);
        }
    };

    const performUpdate = (id, updates) => {
        const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const updatedAllTasks = allTasks.map(t =>
            t.id === id ? { ...t, ...updates } : t
        );
        localStorage.setItem('tasks', JSON.stringify(updatedAllTasks));

        setTasks(prevTasks => prevTasks.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    };

    const deleteTask = (id) => {
        const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const filteredTasks = allTasks.filter(t => t.id !== id);
        localStorage.setItem('tasks', JSON.stringify(filteredTasks));

        setTasks(tasks.filter((t) => t.id !== id));
    };

    const pendingCount = tasks.filter(t => t.status === 'pending').length;
    const completedCount = tasks.filter(t => t.status === 'completed').length;

    const displayedTasks = tasks.filter(task => {
        if (activeTab === 'pending') {
            // Show pending tasks AND tasks that are currently completing (waiting the 5s)
            return task.status === 'pending' || completingTasks.includes(task.id);
        } else {
            // Show completed tasks ONLY if they are not currently in the completing phase
            return task.status === 'completed' && !completingTasks.includes(task.id);
        }
    });

    // Sort: Pending tasks first, then completing tasks at the bottom
    if (activeTab === 'pending') {
        displayedTasks.sort((a, b) => {
            const aIsCompleting = completingTasks.includes(a.id);
            const bIsCompleting = completingTasks.includes(b.id);
            if (aIsCompleting && !bIsCompleting) return 1;
            if (!aIsCompleting && bIsCompleting) return -1;
            return new Date(b.created_at) - new Date(a.created_at);
        });
    }

    return (
        <div className="min-h-screen">
            <nav className="glass-card sticky top-0 z-50 border-b-0 rounded-none">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg">
                                <Layout className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-white">
                                TaskToDo
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="hidden md:flex flex-col items-end mr-2">
                                <span className="text-sm font-medium text-white">{user?.name}</span>
                                <span className="text-xs text-gray-400">{user?.email}</span>
                            </div>
                            <button
                                onClick={logout}
                                className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-red-400 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`glass-card p-6 rounded-2xl text-left transition-all duration-300 ${activeTab === 'pending' ? 'ring-2 ring-primary bg-primary/10' : 'hover:bg-white/5'}`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Pending Tasks</p>
                                <p className="text-3xl font-bold text-white mt-1">{pendingCount}</p>
                            </div>
                            <div className="p-3 bg-primary/20 rounded-xl">
                                <Layout className="w-6 h-6 text-primary" />
                            </div>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`glass-card p-6 rounded-2xl text-left transition-all duration-300 ${activeTab === 'completed' ? 'ring-2 ring-accent bg-accent/10' : 'hover:bg-white/5'}`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Completed</p>
                                <p className="text-3xl font-bold text-white mt-1">{completedCount}</p>
                            </div>
                            <div className="p-3 bg-accent/20 rounded-xl">
                                <CheckSquare className="w-6 h-6 text-accent" />
                            </div>
                        </div>
                    </button>
                </div>

                {activeTab === 'pending' && <TaskForm onAddTask={addTask} />}

                <div className="space-y-4">
                    <AnimatePresence mode='popLayout'>
                        {loading ? (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center text-gray-500 py-10"
                            >
                                Loading tasks...
                            </motion.p>
                        ) : displayedTasks.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-20"
                            >
                                <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckSquare className="w-10 h-10 text-gray-600" />
                                </div>
                                <h3 className="text-xl font-medium text-white">
                                    {activeTab === 'pending' ? 'You are all set for today' : 'No completed tasks yet'}
                                </h3>
                                <p className="text-gray-500 mt-2">
                                    {activeTab === 'pending' ? 'Enjoy your free time!' : 'Complete some tasks to see them here.'}
                                </p>
                            </motion.div>
                        ) : (
                            displayedTasks.map((task) => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    isCompleting={completingTasks.includes(task.id)}
                                    onUpdate={updateTask}
                                    onDelete={deleteTask}
                                />
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
