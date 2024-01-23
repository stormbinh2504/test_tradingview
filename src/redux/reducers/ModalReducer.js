import actionTypes from "../actions/actionTypes";
const initialState = {
  isToggleModal: false,
};

const ModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_TOGGLE_MODAL":
      return {
        ...state,
        isToggleModal: action.isToggleModal,
      };
    default:
      return state;
  }
};

export default ModalReducer;
