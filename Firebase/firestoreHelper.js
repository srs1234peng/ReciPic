import { db } from "./FirebaseSetup";
import {
  onSnapshot, collection, addDoc, deleteDoc, setDoc,
  doc, updateDoc, getDocs, getDoc, documentId, query, where, arrayRemove
} from "firebase/firestore";

export const getGames = async (ids = []) => {
  const querySnapshot = await getDocs(collection(db, "games"));
  const games = [];
  querySnapshot.forEach((doc) => {
    if (ids.includes(doc.id)) {
      games.push(doc.data());
    }
  });
  return games;
}

export const getGameInfo = async (id) => {
  const querySnapshot = await getDocs(collection(db, "games"));
  let gameData = null;
  querySnapshot.forEach((doc) => {
    if (doc.id === id) {
      gameData = doc.data();
    }
  });
  return gameData;
}

export const updateGame = async (id, game) => {
  return await updateDoc(doc(db, "games", id), game);
}

export const checkGameAdded = async (uid, id) => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (!userDoc.exists()) {
    console.log('No such user document!');
    return false;
  }
  const userData = userDoc.data();
  return userData.games.includes(id);
}

export const checkGameExists = async (id) => {
  const gameDoc = await getDoc(doc(db, 'games', id));
  return gameDoc.exists();
}

// export const listenForGames = (ids = [], callback) => {
//   const gamesCollection = collection(db, 'games');

//   return onSnapshot(gamesCollection, (snapshot) => {
//     const games = [];
//     snapshot.forEach((doc) => {
//       if (ids.includes(doc.id)) {
//         games.push({ id: doc.id, ...doc.data() });
//       }
//     });
//     callback(games);
//   });
// };

export const addGame = async (game) => {
  try {
    const gameRef = await addDoc(collection(db, "games"), game);
    return gameRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export const removeGame = async (userId, gameId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      games: arrayRemove(gameId),
    });
  } catch (error) {
    console.error("Error removing game from user:", error);
  }
};

export const getCommentThroughRef = async (commentRef) => {

  const docSnapshot = await getDoc(commentRef);

  if (docSnapshot.exists()) {
    return docSnapshot.data();
  } else {
    // Document does not exist
    console.log("No such document!");
  }
}

export const getComment = async (id) => {
  const querySnapshot = await getDocs(collection(db, "comments"));
  querySnapshot.forEach((doc) => {
    if (doc.id === id) {
      return doc.data();
    }
  });
}

export const updateCommentThroughRef = async (commentRef, comments) => {
  try {
    await updateDoc(commentRef, comments);
  } catch (error) {
    console.error("Error updating document:", error);
  }
  // return await updateDoc(doc(db, "comments", id), comment);
}

export const addComment = async (comment) => {
  return await addDoc(collection(db, "comments"), comment);
}

export const getUser = async (id) => {
  const querySnapshot = await getDocs(collection(db, "users"));
  for (let i = 0; i < querySnapshot.docs.length; i++) {
    if (querySnapshot.docs[i].id === id) {
      return querySnapshot.docs[i].data();
    }
  }
}

export const updateUser = async (id, user) => {
  return await updateDoc(doc(db, "users", id), user);
}

export const addUser = async (uid, user) => {
  return await setDoc(doc(db, "users", uid), user);
}

export const updateGameNotification = async (gameId, notification) => {
  try {
    const gameDocRef = doc(db, "games", gameId);
    await updateDoc(gameDocRef, {
      notification: notification,
    });
    console.log("Notification updated successfully!");
  } catch (error) {
    console.error("Error updating notification:", error);
  }
};
