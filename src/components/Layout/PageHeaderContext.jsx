import React, { createContext, useContext, useState } from "react";

const PageHeaderContext = createContext();

export const PageHeaderProvider = ({ children }) => {
  const [headerAction, setHeaderAction] = useState(null);
  return (
    <PageHeaderContext.Provider value={{ headerAction, setHeaderAction }}>
      {children}
    </PageHeaderContext.Provider>
  );
};

export const usePageHeader = () => useContext(PageHeaderContext);
