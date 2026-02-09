import { useState } from 'react';
import { Plus, Calendar, AlignLeft, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import DateTimePicker from './DateTimePicker';

export default function TaskForm({ onAddTask }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [activePicker, setActivePicker] = useState(null); // 'date' or 'time'

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title) return;

        let finalDate = null;
        if (selectedDate || selectedTime) {
            const dateBase = selectedDate || new Date();
            finalDate = new Date(dateBase);

            if (selectedTime) {
                finalDate.setHours(selectedTime.getHours());
                finalDate.setMinutes(selectedTime.getMinutes());
            } else {
                // Default to end of day if only date selected? Or just keep date.
                // User said: "If I want to do it by tomorrow, then I will add the date."
                // Let's set time to 23:59 if no time specified, or just leave it as is (00:00)
                finalDate.setHours(23, 59, 0, 0);
            }
        }

        onAddTask({
            title,
            description,
            due_date: finalDate ? finalDate.toISOString() : null
        });

        setTitle('');
        setDescription('');
        setSelectedDate(null);
        setSelectedTime(null);
        setActivePicker(null);
        setIsExpanded(false);
    };

    return (
        <motion.form
            layout
            onSubmit={handleSubmit}
            className="glass-card p-6 rounded-2xl mb-8 relative group"
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex flex-col space-y-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="What needs to be done?"
                        className="w-full bg-transparent text-xl font-medium text-white placeholder-gray-500 border-none focus:ring-0 p-0"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onFocus={() => setIsExpanded(true)}
                    />
                </div>

                <motion.div
                    layout
                    initial={false}
                    animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                    className="overflow-hidden"
                >
                    <div className="space-y-4 pt-2">
                        <div className="relative group/input">
                            <AlignLeft className="absolute top-3 left-3 w-5 h-5 text-gray-500 group-focus-within/input:text-primary transition-colors" />
                            <textarea
                                placeholder="Add a description..."
                                className="w-full bg-dark-900/30 rounded-xl py-3 pl-10 pr-4 text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                rows="3"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {/* Time Selection Chip */}
                            {selectedTime ? (
                                <div className="flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm">
                                    <Clock className="w-4 h-4" />
                                    <span>{format(selectedTime, 'h:mm a')}</span>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedTime(null)}
                                        className="hover:text-primary-hover"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setActivePicker(activePicker === 'time' ? null : 'time')}
                                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${activePicker === 'time' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <Clock className="w-4 h-4" />
                                    <span>Add time</span>
                                </button>
                            )}

                            {/* Date Selection Chip */}
                            {selectedDate ? (
                                <div className="flex items-center space-x-2 bg-accent/10 text-accent px-3 py-1.5 rounded-lg text-sm">
                                    <Calendar className="w-4 h-4" />
                                    <span>{format(selectedDate, 'MMM d')}</span>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedDate(null)}
                                        className="hover:text-accent-hover"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setActivePicker(activePicker === 'date' ? null : 'date')}
                                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${activePicker === 'date' ? 'bg-accent text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <Calendar className="w-4 h-4" />
                                    <span>Add date</span>
                                </button>
                            )}
                        </div>

                        <AnimatePresence mode="wait">
                            {activePicker && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="relative">
                                        <DateTimePicker
                                            type={activePicker}
                                            onClose={() => setActivePicker(null)}
                                            onSelect={(val) => {
                                                if (activePicker === 'date') setSelectedDate(val);
                                                else setSelectedTime(val);
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                className="btn-primary py-2 px-6 text-sm flex items-center"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Task
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.form>
    );
}
