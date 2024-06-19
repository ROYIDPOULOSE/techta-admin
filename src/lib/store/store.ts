import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { auth } from "$lib/services/firebase"

// Define the interface for the authStore
interface AuthStoreData {
    user: any;
    loading: boolean;
    data: Record<string, unknown>;
}
  
// Define the interface for the authHandlers
interface AuthHandlers {
    signup: (email: string, pass: string) => Promise<void>;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
}
  
export const authStore: Writable<AuthStoreData> = writable({
    user: null,
    loading: true,
    data: {}
})

export const authHandlers: AuthHandlers = {
    signup: async (email: string, pass: string) => {
        await createUserWithEmailAndPassword(auth, email, pass)
    },
    login: async (email: string, pass: string) => {
        await signInWithEmailAndPassword(auth, email, pass)
    },
    logout: async () => {
        await signOut(auth)
    }
}