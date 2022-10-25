import { data } from "autoprefixer";
import axios from "axios";

const REACT_APP_GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
//const REACT_APP_GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

const github = axios.create({
  baseURL: REACT_APP_GITHUB_URL,
  headers: {},
});

// search users
export const searchUsers = async (text) => {
  const queryParams = new URLSearchParams({
    q: text,
  });

  const response = await github.get(`/search/users?${queryParams}`);
  return response.data.items;

  //   const response = await fetch(
  //     `${REACT_APP_GITHUB_URL}/search/users?${queryParams}`,
  //     {
  //     }
  //   );
  //   const { items } = await response.json();
  //   return items;
};

export const getUserAndRepos = async (login) => {
  const queryParams = new URLSearchParams({
    sort: "created",
    per_page: 10,
  });
  const [user, repos] = await Promise.all([
    github.get(`/users/${login}`),
    github.get(`/users/${login}/repos?${queryParams}`),
  ]);
  return { user: user.data, repos: repos.data };
};
