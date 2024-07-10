import { createContext, useReducer, useEffect } from "react";

let userData = {
  uid: "",
  email: "",
  emailVerified: null,
  providerData: [
    {
      providerId: "",
      uid: "",
      email: ""
    }
  ],
  lastLoginAt: ""
}

const INITIAL_STATE = {
  currentUser: JSON.parse(localStorage.getItem("user")) || userData,
};

export const AuthContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      window.location.reload()
      return {
        ...state,
        currentUser: action.payload,
      };

    case "ORDER":
      window.location.reload()
      return {
        ...state,
        currentUser: action.payload
      };

    case "LOGOUT": {
      let userData = {
        uid: "",
        email: "",
        emailVerified: null,
        providerData: [
          {
            providerId: "",
            uid: "",
            email: ""
          }
        ],
        lastLoginAt: ""
      }
      localStorage.setItem("user", JSON.stringify(userData))
      return {
        currentUser: userData
      };
    }
    default:
      return state;
  }
};

const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.currentUser));
  }, [state.currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser: state.currentUser, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
