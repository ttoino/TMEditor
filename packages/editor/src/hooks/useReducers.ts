import { getReducers, putReducers } from "@app/api";
import useLocalState from "./useLocalState";

const useReducers = () =>
    useLocalState<string>("reducers", getReducers, putReducers);

export default useReducers;
