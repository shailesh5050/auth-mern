import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { authFirebase } from "../firebase";
import { signInSuccess } from "../redux/userSlice";
import { useDispatch } from "react-redux";
const OAuth = () => {
  const disatch = useDispatch();
  async function handleClick() {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(authFirebase);
      const result = await signInWithPopup(auth, provider);
      const res = await fetch("api/auth/google", {
        method: "POST",
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      disatch(signInSuccess(data));
    } catch (error) {
      console.error("Error:", error);
    }
  }
  return (
    <button
      className="bg-green-400 hover:bg-green-500 text-yellow-100 font-semibold py-2 px-4 border border-green-500  rounded shadow"
      onClick={handleClick}
    >
      <img
        className="inline-block h-6 w-6 mr-2"
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google Logo"
      />
      Sign In With Google
    </button>
  );
};

export default OAuth;
