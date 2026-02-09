import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for logged in user in localStorage on mount
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const foundUser = users.find(u => u.email === email && u.password === password);

        if (foundUser) {
            const { password, ...userWithoutPassword } = foundUser;
            localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
            setUser(userWithoutPassword);
        } else {
            throw new Error('Invalid email or password');
        }
    };

    const register = async (name, email, password) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const users = JSON.parse(localStorage.getItem('users') || '[]');

        if (users.find(u => u.email === email)) {
            throw new Error('User already exists');
        }

        const newUser = { id: Date.now(), name, email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        const { password: _, ...userWithoutPassword } = newUser;
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        setUser(userWithoutPassword);
    };

    const logout = async () => {
        localStorage.removeItem('currentUser');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
