import React, { createContext, useCallback, useContext, useState } from "react";
import { v4 as uuid } from "uuid";
import AlertContainer from "../components/alert-container";

interface IAlertMessage {
    id: string;
    type?: "success" | "info" | "warning" | "error";
    title: string;
    description?: string;
}

interface IAlertContextData {
    addAlert(message: Omit<IAlertMessage, 'id'>): void;
    removeAlert(id: string): void;
}

interface IProps {
    children?: React.ReactNode
};

const AlertContext = createContext<IAlertContextData>({} as IAlertContextData);

const AlertProvider: React.FC<IProps> = ({ children }) => {
    const [messages, setMessages] = useState<IAlertMessage[]>([]);

    const removeAlert = useCallback((id: string) => {
        setMessages(state => state.filter(message => message.id !== id));
    }, []);

    const autoRemover = useCallback((id: string) => {
        const timer = setTimeout(() => removeAlert(id), 3000);
        return () => { clearTimeout(timer); };
    }, [removeAlert]);

    const addAlert = useCallback((message: Omit<IAlertMessage, 'id'>) => {
        const id = uuid();
        const alert = { id, ...message };
        setMessages(state => [...state, alert]);
        autoRemover(id);
    }, [autoRemover]);

    return (
        <AlertContext.Provider value={{ addAlert, removeAlert }}>
            {children}
            <AlertContainer messages={messages} />
        </AlertContext.Provider>
    );
};

function useAlert(): IAlertContextData {
    const context = useContext(AlertContext);

    if (!context) {
        throw new Error('useAlert must be used within a AlertProvider');
    }

    return context;
}

export { AlertProvider, useAlert };
export type { IAlertMessage };
export default useAlert;