import FirebaseService from './firebase';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';

export class AuthService {
  private auth = FirebaseService.auth;

  async signIn(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(this.auth, email, password);
    return cred.user;
  }

  async signUp(email: string, password: string) {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    return cred.user;
  }

  async signOut() {
    await signOut(this.auth);
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(this.auth, callback);
  }
}

export default new AuthService();
