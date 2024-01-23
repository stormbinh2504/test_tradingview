import ThemeReducer from "./ThemeReducer";
import LanguageReducer from "./LanguageReducer";
import ModalReducer from "./ModalReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  ThemeReducer,
  LanguageReducer,
  ModalReducer,
});

export default rootReducer;
