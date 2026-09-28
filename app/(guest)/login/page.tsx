"use client"

import { AuthContext } from "@/context/AuthContext";
import { useContext, useState } from "react";

const Auth = () => {

  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error("Auth page must be within AuthContextProvider");
  const { register, login, authLoading } = authContext;

  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (state === "Login") {
      await login({ email, password });
    } else {
      await register({ name, email, password });
    }
  };

  return (
    
      <div className="flex items-center justify-center mt-10 md:mt-30 max-md:pb-30">
        <form
          onSubmit={handleSubmit}
          className="bg-white text-gray-500 max-w-85 w-full mx-4 md:p-6 p-4 py-8 text-left
            text-sm rounded-lg shadow-[0px_0px_10px_0px] shadow-black/10"
        >
          <h2 className="text-2xl font-bold mb-9 text-center text-gray-800">
            {state === "Login" ? "Login" : "Register"}
          </h2>
          {state === "Register" && (
            <div className="flex items-center my-2 border bg-indigo-500/5 border-gray-500/10 rounded gap-1 pl-2">
              <svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M3.125 13.125a4.375 4.375 0 0 1 8.75 0M10 4.375a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"
                  stroke="#6B7280"
                  strokeOpacity=".6"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="w-full outline-none bg-transparent py-2.5"
                type="text"
                placeholder="Name"
                required
              />
            </div>
          )}
          <div className="flex items-center my-2 border bg-indigo-500/5 border-gray-500/10 rounded gap-1 pl-2">
            <svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="m2.5 4.375 3.875 2.906c.667.5 1.583.5 2.25 0L12.5 4.375"
                stroke="#6B7280"
                strokeOpacity=".6"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.875 3.125h-8.75c-.69 0-1.25.56-1.25 1.25v6.25c0 .69.56 1.25 1.25 1.25h8.75c.69
              0 1.25-.56 1.25-1.25v-6.25c0-.69-.56-1.25-1.25-1.25Z"
                stroke="#6B7280"
                strokeOpacity=".6"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full outline-none bg-transparent py-2.5"
              type="email"
              placeholder="Email"
              required
            />
          </div>
          <div className="flex items-center mt-2 mb-8 border bg-indigo-500/5 border-gray-500/10 rounded gap-1 pl-2">
            <svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="m2.5 4.375 3.875 2.906c.667.5 1.583.5 2.25 0L12.5 4.375"
                stroke="#6B7280"
                strokeOpacity=".6"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.875 3.125h-8.75c-.69 0-1.25.56-1.25 1.25v6.25c0 .69.56 1.25 1.25 1.25h8.75c.69 0 1.25-.56
              1.25-1.25v-6.25c0-.69-.56-1.25-1.25-1.25Z"
                stroke="#6B7280"
                strokeOpacity=".6"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full outline-none bg-transparent py-2.5"
              type="password"
              placeholder="Password"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full mb-3 bg-indigo-500 hover:bg-indigo-600 transition-all active:scale-95
              py-2.5 rounded text-white font-medium ${authLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={authLoading}
          >
            {authLoading
              ? "Loading..."
              : state === "Login"
                ? "Login"
                : "Register"}
          </button>

          <div className="text-center mt-4">
            {state === "Login" ? (
              <p>Don&apos;t have an account? {""}
                <span onClick={() => setState("Register")} className="text-blue-500 underline cursor-pointer">
                  Register
                </span>
              </p>
            ) : (
              <p>Already have an account? {""}
                <span onClick={() => setState("Login")} className="text-blue-500 underline cursor-pointer">
                  Login
                </span>
              </p>
            )}
          </div>
        </form>
      </div>

  );
};

export default Auth;