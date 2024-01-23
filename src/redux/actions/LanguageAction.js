export const setLanguage = (language) => {
  return (dispatch, getState) => {
    const getstate = getState();
    return dispatch({
      type: "SET_LANGUAGE",
      language,
    });
  };
};
