import { 
  doc, 
  getDoc, 
  updateDoc, 
  setDoc, 
  collection, 
  addDoc, 
  serverTimestamp,
  increment,
  runTransaction
} from 'firebase/firestore';
import { db } from './config';

export const trackProjectView = async (projectId: string) => {
  try {
    const statsRef = doc(db, 'projectStats', projectId);
    const viewRef = collection(statsRef, 'views');
    
    // Get client IP (rough approximation for client-side)
    const ipResponse = await fetch('https://api.ipify.org?format=json').catch(() => ({ json: () => ({ ip: 'unknown' }) }));
    const { ip } = await ipResponse.json();

    await runTransaction(db, async (transaction) => {
      const statsDoc = await transaction.get(statsRef);
      if (!statsDoc.exists()) {
        transaction.set(statsRef, { views: 1, likes: 0 });
      } else {
        transaction.update(statsRef, { views: increment(1) });
      }
      
      // Add record to views subcollection
      const newViewRef = doc(viewRef);
      transaction.set(newViewRef, {
        ip,
        timestamp: serverTimestamp()
      });
    });
  } catch (error) {
    console.error('Error tracking view:', error);
  }
};

export const toggleProjectLike = async (projectId: string, isLiked: boolean) => {
  try {
    const statsRef = doc(db, 'projectStats', projectId);
    const likeRef = collection(statsRef, 'likes');
    
    const ipResponse = await fetch('https://api.ipify.org?format=json').catch(() => ({ json: () => ({ ip: 'unknown' }) }));
    const { ip } = await ipResponse.json();

    await runTransaction(db, async (transaction) => {
      const statsDoc = await transaction.get(statsRef);
      if (!statsDoc.exists()) {
        transaction.set(statsRef, { views: 0, likes: isLiked ? 1 : 0 });
      } else {
        transaction.update(statsRef, { likes: increment(isLiked ? 1 : -1) });
      }
      
      if (isLiked) {
        const newLikeRef = doc(likeRef);
        transaction.set(newLikeRef, {
          ip,
          timestamp: serverTimestamp()
        });
      }
    });
  } catch (error) {
    console.error('Error toggling like:', error);
  }
};
