import { createContext, useReducer } from "react";
import githubReducer from "./GithubReducer";

const GithubContext = createContext();

const REACT_APP_GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const REACT_APP_GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

export const GithubProvider = ({ children }) => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  };

  const [state, dispatch] = useReducer(githubReducer, initialState);
  // clear users
  const clearUsers = () => {
    dispatch({ type: "CLEAR_USERS" });
  };

  // get user repos
  const getUserRepos = async (login) => {
    setLoading();

    const queryParams = new URLSearchParams({
      sort: "created",
      per_page: 10,
    });
    const response = await fetch(
      `${REACT_APP_GITHUB_URL}/users/${login}/repos?${queryParams}`,
      {}
    );
    const data = await response.json();

    dispatch({ type: "GET_REPOS", payload: data });
  };

  // get user details
  const getUser = async (login) => {
    setLoading();
    //console.log("Inside getUser login", login);
    const response = await fetch(`${REACT_APP_GITHUB_URL}/users/${login}`, {});

    if (response.status === 404) {
      //console.log("Redirecting", response);
      window.location = "/notfound";
    } else {
      //console.log("Inside getUser", response);
      const data = await response.json();

      dispatch({ type: "GET_USER", payload: data });
    }
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
        // headers: {
        //   Authorization: `token ${REACT_APP_GITHUB_TOKEN}`,
        // },
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
        user: state.user,
        repos: state.repos,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
