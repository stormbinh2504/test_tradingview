const LanguageReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_LANGUAGE":
      return {
        ...state,
        language: action.language,
      };
    default:
      return state;
  }
};

export default LanguageReducer;
