import FirebaseService from './firebase';
import { collection, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';

export class FirestoreService {
  private db = FirebaseService.db;

  collectionRef(collectionName: string) {
    return collection(this.db, collectionName);
  }

  async add(collectionName: string, data: Record<string, unknown>) {
    const ref = this.collectionRef(collectionName);
    return await addDoc(ref, data as Record<string, unknown>);
  }

  docRef(collectionName: string, id: string) {
    return doc(this.db, collectionName, id);
  }

  async getDoc(collectionName: string, id: string) {
    const d = this.docRef(collectionName, id);
    return await getDoc(d).then(snap => snap.exists() ? (snap.data() as Record<string, unknown>) : null);
  }

  async setDoc(collectionName: string, id: string, data: Record<string, unknown>) {
    const d = this.docRef(collectionName, id);
    return await setDoc(d, data, { merge: true });
  }
}

export default new FirestoreService();
