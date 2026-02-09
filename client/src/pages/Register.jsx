import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to register');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full glass-card p-8 rounded-2xl relative overflow-hidden"
            >
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white">
                            Create Account
                        </h2>
                        <p className="mt-2 text-gray-400">Join us and start organizing today</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <div className="relative group">
                                <User className="absolute top-3.5 left-4 h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    required
                                    className="input-field pl-12"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="relative group">
                                <Mail className="absolute top-3.5 left-4 h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    required
                                    className="input-field pl-12"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute top-3.5 left-4 h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    required
                                    className="input-field pl-12"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary w-full flex items-center justify-center group">
                            Get Started
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary hover:text-primary-hover transition-colors">
                            Sign in instead
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
