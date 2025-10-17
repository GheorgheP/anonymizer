import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import type { AppDispatch, RootState } from "src/content/store/index";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
