export const getCurrentUser = state => {
  return state.auth.user;
};

export const isSigningIn = state => {
  return state.auth.loading;
};
