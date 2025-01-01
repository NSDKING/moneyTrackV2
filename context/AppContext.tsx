import { AppContextType, Category, Transaction, Wallet } from '@/assets/types';
import React, { createContext, useContext, useState } from 'react';


const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [BudgetArray, setBudgetArray]=useState<Category[]>([]);


    return (
        <AppContext.Provider value={{ wallets, setWallets, transactions, setTransactions, categories, setCategories, BudgetArray, setBudgetArray }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
