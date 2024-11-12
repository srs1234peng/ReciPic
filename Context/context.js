import React, { createContext, useEffect, useState } from 'react';

const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [pickedLocation, setPickedLocation] = useState(null);

  return (
    <Context.Provider value={{
      user,
      setUser,
      pickedLocation,
      setPickedLocation
    }}>
      {children}
    </Context.Provider>
  );
};

export default Context;
