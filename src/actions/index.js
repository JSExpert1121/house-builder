import {
	SET_USER_PROFILE
} from '../constants/global-action-types'

export function setUserProfile(payload) {
	return { type: SET_USER_PROFILE, payload }
}