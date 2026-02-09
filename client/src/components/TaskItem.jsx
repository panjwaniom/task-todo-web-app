import { Trash2, CheckCircle, Circle, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function TaskItem({ task, isCompleting, onUpdate, onDelete }) {
    const isCompleted = task.status === 'completed';

    return (
        <motion.div
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: isCompleting ? 0.5 : 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ scale: 1.01 }}
            className={`glass-card p-5 rounded-xl flex items-center justify-between group transition-all duration-300 ${isCompleted ? 'opacity-60' : 'opacity-100'}`}
        >
            <div className="flex items-start space-x-4 flex-1">
                <button
                    onClick={() => onUpdate(task.id, { status: isCompleted ? 'pending' : 'completed' })}
                    disabled={isCompleting}
                    className={`mt-1 transition-colors duration-300 ${isCompleted || isCompleting ? 'text-accent' : 'text-gray-500 hover:text-accent'}`}
                >
                    {isCompleted || isCompleting ? (
                        <CheckCircle className="w-6 h-6" />
                    ) : (
                        <Circle className="w-6 h-6" />
                    )}
                </button>

                <div className="flex-1">
                    <h3 className={`text-lg font-medium transition-all duration-300 ${isCompleted ? 'line-through text-gray-500' : 'text-white'}`}>
                        {task.title}
                    </h3>

                    {task.description && (
                        <p className={`mt-1 text-sm transition-all duration-300 ${isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                            {task.description}
                        </p>
                    )}

                    <div className="flex items-center space-x-4 mt-3">
                        {task.due_date && (
                            <div className={`flex items-center text-xs ${isCompleted ? 'text-neutral' : 'text-primary-hover'} bg-primary/10 px-2 py-1 rounded-md`}>
                                <Clock className="w-3 h-3 mr-1.5" />
                                <span>Complete by {format(new Date(task.due_date), 'MMM d, h:mm a')}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <button
                onClick={() => onDelete(task.id)}
                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </motion.div>
    );
}
