import { account } from "../appwrite/config";

const googleLogin = () => {
  account.createOAuth2Session(
    "google",
    "http://localhost:3000/",      // success redirect
    "http://localhost:3000/login"  // failure redirect
  );
};

export default function GoogleAuthButton() {
  return (
    <button
      onClick={googleLogin}
      className="w-full py-3 rounded-xl bg-zinc-950 text-yellow-400 font-semibold"
    >
      Continue with Google
    </button>
  );
}
