import actionTypes from "../actions/actionTypes";

export const setToggleModal = (isToggleModal) => {
  return (dispatch) => {
    console.log("acisToggleModal", isToggleModal);
    return dispatch({
      type: "SET_TOGGLE_MODAL",
      isToggleModal,
    });
  };
};
