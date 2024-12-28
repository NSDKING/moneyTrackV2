import React, { createContext, useContext, useState } from 'react';

interface ModalContextType {
   isNoteModalVisible: boolean;
   setIsNoteModalVisible: (visible: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
   const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
   
   return (
       <ModalContext.Provider value={{ isNoteModalVisible, setIsNoteModalVisible }}>
           {children}
       </ModalContext.Provider>
   );
}

export function useModal() {
   const context = useContext(ModalContext);
   if (context === undefined) {
       throw new Error('useModal must be used within a ModalProvider');
   }
   return context;
}
