import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, setHours, setMinutes } from 'date-fns';

export default function DateTimePicker({ type, onClose, onSelect }) {
    // Date Picker State
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Time Picker State
    const [selectedHour, setSelectedHour] = useState(12);
    const [selectedMinute, setSelectedMinute] = useState(0);
    const [period, setPeriod] = useState('PM');

    const days = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    const handleDateSelect = (date) => {
        onSelect(date);
        onClose();
    };

    const handleTimeSelect = () => {
        const now = new Date();
        let hours = selectedHour;
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        const timeDate = setMinutes(setHours(now, hours), selectedMinute);
        onSelect(timeDate);
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="glass-card p-4 w-full max-w-sm mx-auto"
        >
            {type === 'date' ? (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                            className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="font-medium text-white">
                            {format(currentMonth, 'MMMM yyyy')}
                        </span>
                        <button
                            type="button"
                            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                            className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                            <div key={d}>{d}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {days.map((day, dayIdx) => (
                            <button
                                key={day.toString()}
                                type="button"
                                onClick={() => handleDateSelect(day)}
                                className={`
                                    p-2 rounded-lg text-sm relative
                                    ${!isSameMonth(day, currentMonth) ? 'text-gray-600' : 'text-gray-300'}
                                    ${isToday(day) ? 'text-primary font-bold' : ''}
                                    hover:bg-primary/20 hover:text-primary transition-colors
                                `}
                            >
                                {format(day, 'd')}
                                {isToday(day) && (
                                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="text-center text-white font-medium mb-4">Select Time</div>
                    <div className="flex justify-center space-x-2 h-32">
                        {/* Hours */}
                        <div className="flex flex-col overflow-y-auto no-scrollbar w-16 bg-white/5 rounded-lg snap-y snap-mandatory">
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                                <button
                                    key={h}
                                    type="button"
                                    onClick={() => setSelectedHour(h)}
                                    className={`flex-shrink-0 h-10 flex items-center justify-center snap-center transition-colors ${selectedHour === h ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-200'}`}
                                >
                                    {h}
                                </button>
                            ))}
                        </div>

                        {/* Minutes */}
                        <div className="flex flex-col overflow-y-auto no-scrollbar w-16 bg-white/5 rounded-lg snap-y snap-mandatory">
                            {Array.from({ length: 12 }, (_, i) => i * 5).map(m => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => setSelectedMinute(m)}
                                    className={`flex-shrink-0 h-10 flex items-center justify-center snap-center transition-colors ${selectedMinute === m ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-200'}`}
                                >
                                    {m.toString().padStart(2, '0')}
                                </button>
                            ))}
                        </div>

                        {/* AM/PM */}
                        <div className="flex flex-col bg-white/5 rounded-lg">
                            {['AM', 'PM'].map(p => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setPeriod(p)}
                                    className={`flex-1 w-16 flex items-center justify-center transition-colors rounded-lg ${period === p ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-200'}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleTimeSelect}
                        className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                    >
                        Set Time
                    </button>
                </div>
            )}
        </motion.div>
    );
}
