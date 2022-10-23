import { createContext, useReducer } from "react";
import githubReducer from "./GithubReducer";

const GithubContext = createContext();

const REACT_APP_GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const REACT_APP_GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

export const GithubProvider = ({ children }) => {
  const initialState = {
    users: [],
    loading: false,
  };

  const [state, dispatch] = useReducer(githubReducer, initialState);
  // clear users
  const clearUsers = () => {
    dispatch({ type: "CLEAR_USERS" });
  };

  // search users
  const searchUsers = async (text) => {
    setLoading();
    const queryParams = new URLSearchParams({
      q: text,
    });

    const response = await fetch(
      `${REACT_APP_GITHUB_URL}/search/users?${queryParams}`,
      {
        headers: {
          Authorization: `token ${REACT_APP_GITHUB_TOKEN}`,
        },
      }
    );
    const { items } = await response.json();

    dispatch({ type: "GET_USERS", payload: items });
  };

  const setLoading = () =>
    dispatch({
      type: "SET_LOADING",
    });

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        loading: state.loading,
        searchUsers,
        clearUsers,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
