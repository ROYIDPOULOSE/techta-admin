<script>
    import "../app.css";
    import { onMount } from "svelte";
    import { auth, db } from '$lib/services/firebase'
    import { getDoc, doc, setDoc } from 'firebase/firestore'
    import { authStore } from '$lib/store/store'

    const nonAuthRoutes = ['/']
    onMount(() => {
        console.log('Mounting');
        const unsubscribe = auth.onAuthStateChanged(async user => {
            const currentPath = window.location.pathname;

            if (!user && !nonAuthRoutes.includes(currentPath)) {
                window.location.href = "/";
                return;
            }

            if (user && currentPath === "/login") {
                window.location.href = "/admin/dashboard";
                return;
            }

            if (!user) {
                return;
            }

            let dataToSetToStore;
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                const userRef = doc(db, "user", user.uid);
                dataToSetToStore = {
                    email: user.email,
                    todos: [],
                }
                await setDoc(
                    userRef, dataToSetToStore, { merge: true});
            } else {
                const userData = docSnap.data();
                dataToSetToStore = userData;
            }

            authStore.update((curr) => {
                return {
                    ...curr,
                    user,
                    data: dataToSetToStore,
                    loading: false,
                };
            });
        });
    });
</script>

<div>
    <slot/>
</div>