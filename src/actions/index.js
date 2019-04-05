import { ADD_PROJECT, SET_SELECTED_PROJECT, SET_CUR_TAB_POS, SET_SELECTED_PROPOSAL } from "../constants/action-types";

export function addProject(payload) {
	return { type: ADD_PROJECT, payload }
};

export function setSelectedProject(payload) {
	return { type: SET_SELECTED_PROJECT, payload }
};

export function setCurTabPos(payload) {
	return { type: SET_CUR_TAB_POS, payload }
};

export function setSelectedProposal(payload) {
	return { type: SET_SELECTED_PROPOSAL, payload }
}