import {
	PROPOSALS_LOADED
} from '../constants/sub-action-types';

import Axios from 'axios';

export function getProposals(cont_id, page, row, filterStr) {
	return function (dispatch) {
		dispatch({ type: "CLEAR_PROPOSALS" });
		return Axios.get(process.env.PROJECT_API + 'contractors/' + cont_id + '/proposals', {
			params: {
				'page': page,
				'size': row,
				'status': filterStr
			}
		})
			.then(res => {
				const result = res.data;
				console.log(result);
				//result.content = result.content.filter(cont => cont.status === filterStr);
				dispatch({ type: PROPOSALS_LOADED, payload: result });
			})
			.catch(err => {
				console.log(err.message);
			})
	}
}