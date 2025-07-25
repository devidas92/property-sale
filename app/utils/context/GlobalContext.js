"use client";
import getUnreadMessageCount from "@/app/actions/getUnreadMessageCount";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [unreadCount, setReadCount] = useState(0);
  const { data: session } = useSession();
  useEffect(() => {
    if (session && session.user) {
      getUnreadMessageCount().then((res) => {
        if (res.count) setReadCount(res.count);
      });
    }
  }, [getUnreadMessageCount, session]);
  return (
    <GlobalContext.Provider value={{ unreadCount, setReadCount }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
