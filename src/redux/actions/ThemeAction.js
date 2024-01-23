// const setMode = (mode) => {
//   return {
//     type: "SET_MODE",
//     payload: mode,
//   };
// };
const getTheme = () => {
  return {
    type: "GET_THEME",
  };
};

export const setMode = (mode) => {
  return (dispatch) => {
    return dispatch({
      type: "SET_MODE",
      mode,
    });
  };
};
