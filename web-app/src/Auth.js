import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Google and Facebook as auth providers.
  signInOptions: [GoogleAuthProvider.PROVIDER_ID],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

export default function Auth() {
  const auth = getAuth();
  const [user, setUser] = useState(null); // Local signed-in state.
  const formRef = useRef();

  useEffect(() => {
    const unregisterAuthObserver = onAuthStateChanged(auth, (user) => {
      console.log('onAuthStateChanged', user);
      setUser(user);
    });
    // Make sure we un-register Firebase observers when the component unmounts.
    return () => unregisterAuthObserver();
  }, [auth]);

  return (
    <div style={{ display: 'inline-block' }}>
      {user ? (
        <div>
          <p>Name: {user.displayName}</p>
          <p>Email: {user.email}</p>
          <p>
            <img src={user.photoURL} alt="avatar" />
          </p>
          <button onClick={() => signOut(auth)}>Sign out</button>
        </div>
      ) : (
        <>
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
          <form
            ref={formRef}
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <button
              type="button"
              onClick={async () => {
                try {
                  await createUserWithEmailAndPassword(
                    auth,
                    formRef.current.email.value,
                    formRef.current.password.value
                  );
                } catch (err) {
                  alert(err.message);
                }
              }}
            >
              Sign up
            </button>
            <button
              type="button"
              onClick={async () => {
                try {
                  await signInWithEmailAndPassword(
                    auth,
                    formRef.current.email.value,
                    formRef.current.password.value
                  );
                } catch (err) {
                  alert(err.message);
                }
              }}
            >
              Login
            </button>
          </form>
        </>
      )}
    </div>
  );
}
