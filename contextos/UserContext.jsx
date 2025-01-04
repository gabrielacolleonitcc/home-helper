import React, { createContext, useState } from 'react';

// Cria o contexto
export const UserContext = createContext({
    user: null,
    login: (userData, type) => { },
    logout: () => { },
});

// Cria o provider
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [type, setType] = useState(null);
    // Função para logar o  usuário
    const login = (userData, type) => {
        console.log(userData);
        console.log(type);
        setUser(userData);
        setType(type);
    };

    // Função para deslogar o usuário
    const logout = () => {
        setUser(null);
        navigate('Acesso');
    };

    return <UserContext.Provider value={{ user, login, logout }}>
        {children}
    </UserContext.Provider>;

};
