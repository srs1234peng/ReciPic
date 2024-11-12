import React, { useContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Firebase/FirebaseSetup';
import Context from './context';
import { getUser } from '../Firebase/firestoreHelper';

function AuthStateListener({ children }) {
  const { setUser } = useContext(Context);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getUser(user.uid).then((userInfo) => {
          setUser({
            ...userInfo,
            uid: user.uid,
          });
        });
      } else {
        setUser(null);
      }
    });

    return unsubscribe; // Cleanup the listener on unmount
  }, []);

  return children;
}

export default AuthStateListener;
