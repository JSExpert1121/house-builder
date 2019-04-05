import { ADD_PROJECT, SET_SELECTED_PROJECT, SET_CUR_TAB_POS } from "../constants/action-types";

export function addProject(payload) {
	return { type: ADD_PROJECT, payload }
};

export function setSelectedProject(payload) {
	return { type: SET_SELECTED_PROJECT, payload }
};

export function setCurTabPos(payload) {
	return { type: SET_CUR_TAB_POS, payload }
};