import { ADD_PROJECT, SET_SELECTED_PROJECT, SET_CUR_TAB_POS, SET_SELECTED_PROPOSAL } from "../constants/action-types";
import uuidv1 from "uuid";

const initialState = {
	selectedProject: null,
	selectedProposal: null,
	curTabPos: 0,
	projects: [
		{
			id: uuidv1(),
			name: "Project1",
			status: "Active",
			PH1: "Hello Project1",
			PH2: "Hello Project1",
			bidders: [
				{
					id: uuidv1(),
					name: "Ivan",
					price: 100,
					duration: 3,
					proposal: "I hate Generic Bid",
					subfiles: [
						"Screenshot1.jpg",
						"Screenshot2.jpg",
						"Screenshot3.jpg"
					]
				},
				{
					id: uuidv1(),
					name: "Windi",
					price: 200,
					duration: 5,
					proposal: "I hate Generic Bid",
					subfiles: [
						"Screenshot1.jpg",
						"Screenshot2.jpg",
						"Screenshot3.jpg"
					]
				}
			],
			files: [
				{
					id: uuidv1(),
					name: "File1.XXX",
					url: "XXX"
				},
				{
					id: uuidv1(),
					name: "File2.XXX",
					url: "XXX"
				},
				{
					id: uuidv1(),
					name: "File3.XXX",
					url: "XXX"
				}
			],
			messages: [
				{
					from: "Ivan",
					subject: "Subject1",
					date: new Date(),
					detail: "HAHAHA"
				},
				{
					from: "Ivan",
					subject: "Subject1",
					date: new Date(),
					detail: "HAHAHA"
				},
				{
					from: "Ivan",
					subject: "Subject1",
					date: new Date(),
					detail: "HAHAHA"
				},
				{
					from: "Windi",
					subject: "Subject1",
					date: new Date(),
					detail: "HAHAHA"
				},
			]
		},
		{
			id: uuidv1(),
			name: "Project2",
			status: "Active",
			PH1: "Hello Project2",
			PH2: "Hello Project2",
			bidders: [
				{
					id: uuidv1(),
					name: "Ivan",
					price: 100,
					duration: 3,
					proposal: "I hate Generic Bid",
					subfiles: [
						"Screenshot1.jpg",
						"Screenshot2.jpg",
						"Screenshot3.jpg"
					]
				},
				{
					id: uuidv1(),
					name: "Windi",
					price: 200,
					duration: 5,
					proposal: "I hate Generic Bid",
					subfiles: [
						"Screenshot1.jpg",
						"Screenshot2.jpg",
						"Screenshot3.jpg"
					]
				}
			],
			files: [
				{
					id: uuidv1(),
					name: "File1.XXX",
					url: "XXX"
				},
				{
					id: uuidv1(),
					name: "File2.XXX",
					url: "XXX"
				},
				{
					id: uuidv1(),
					name: "File3.XXX",
					url: "XXX"
				}
			],
			messages: [
				{
					from: "Ivan",
					subject: "Subject1",
					date: new Date(),
					detail: "HAHAHA"
				},
				{
					from: "Ivan",
					subject: "Subject1",
					date: new Date(),
					detail: "HAHAHA"
				},
				{
					from: "Ivan",
					subject: "Subject1",
					date: new Date(),
					detail: "HAHAHA"
				},
				{
					from: "Windi",
					subject: "Subject1",
					date: new Date(),
					detail: "HAHAHA"
				},
			]
		},
		{
			id: uuidv1(),
			name: "Project3",
			status: "Active",
			PH1: "Hello Project3",
			PH2: "Hello Project3",
			bidders: [
				{
					id: uuidv1(),
					name: "Ivan",
					price: 100,
					duration: 3,
					proposal: "I hate Generic Bid",
					subfiles: [
						"Screenshot1.jpg",
						"Screenshot2.jpg",
						"Screenshot3.jpg"
					]
				},
				{
					id: uuidv1(),
					name: "Windi",
					price: 200,
					duration: 5,
					proposal: "I hate Generic Bid",
					subfiles: [
						"Screenshot1.jpg",
						"Screenshot2.jpg",
						"Screenshot3.jpg"
					]
				}
			],
			files: [
				{
					id: uuidv1(),
					name: "File1.XXX",
					url: "XXX"
				},
				{
					id: uuidv1(),
					name: "File2.XXX",
					url: "XXX"
				},
				{
					id: uuidv1(),
					name: "File3.XXX",
					url: "XXX"
				}
			],
			messages: [
				{
					from: "Ivan",
					subject: "Subject1",
					date: new Date(),
					detail: "HAHAHA"
				},
				{
					from: "Ivan",
					subject: "Subject1",
					date: new Date(),
					detail: "HAHAHA"
				},
				{
					from: "Ivan",
					subject: "Subject1",
					date: new Date(),
					detail: "HAHAHA"
				},
				{
					from: "Windi",
					subject: "Subject1",
					date: new Date(),
					detail: "HAHAHA"
				},
			]
		},
		{
			id: uuidv1(),
			name: "Project4",
			status: "Paused",
			PH1: "Hello Project4",
			PH2: "Hello Project4",
			bidders: [
				{
					id: uuidv1(),
					name: "Ivan",
					price: 100,
					duration: 3,
					proposal: "I hate Generic Bid",
					subfiles: [
						"Screenshot1.jpg",
						"Screenshot2.jpg",
						"Screenshot3.jpg"
					]
				},
				{
					id: uuidv1(),
					name: "Windi",
					price: 200,
					duration: 5,
					proposal: "I hate Generic Bid",
					subfiles: [
						"Screenshot1.jpg",
						"Screenshot2.jpg",
						"Screenshot3.jpg"
					]
				}
			],
			files: [
				{
					id: uuidv1(),
					name: "File1.XXX",
					url: "XXX"
				},
				{
					id: uuidv1(),
					name: "File2.XXX",
					url: "XXX"
				},
				{
					id: uuidv1(),
					name: "File3.XXX",
					url: "XXX"
				}
			],
			messages: [
				{
					from: "Ivan",
					subject: "Subject1",
					date: new Date(),
					detail: "HAHAHA"
				},
				{
					from: "Ivan",
					subject: "Subject1",
					date: new Date(),
					detail: "HAHAHA"
				},
				{
					from: "Ivan",
					subject: "Subject1",
					date: new Date(),
					detail: "HAHAHA"
				},
				{
					from: "Windi",
					subject: "Subject1",
					date: new Date(),
					detail: "HAHAHA"
				},
			]
		},
		{
			id: uuidv1(),
			name: "Project5",
			status: "Ended",
			PH1: "Hello Project5",
			PH2: "Hello Project5",
			bidders: [
				{
					id: uuidv1(),
					name: "Ivan",
					price: 100,
					duration: 3,
					proposal: "I hate Generic Bid",
					subfiles: [
						"Screenshot1.jpg",
						"Screenshot2.jpg",
						"Screenshot3.jpg"
					]
				},
				{
					id: uuidv1(),
					name: "Windi",
					price: 200,
					duration: 5,
					proposal: "I hate Generic Bid",
					subfiles: [
						"Screenshot1.jpg",
						"Screenshot2.jpg",
						"Screenshot3.jpg"
					]
				}
			],
			files: [
				{
					id: uuidv1(),
					name: "File1.XXX",
					url: "XXX"
				},
				{
					id: uuidv1(),
					name: "File2.XXX",
					url: "XXX"
				},
				{
					id: uuidv1(),
					name: "File3.XXX",
					url: "XXX"
				}
			],
			messages: [
				{
					from: "Ivan",
					subject: "Subject1",
					date: new Date(),
					detail: "HAHAHA"
				},
				{
					from: "Ivan",
					subject: "Subject1",
					date: new Date(),
					detail: "HAHAHA"
				},
				{
					from: "Ivan",
					subject: "Subject1",
					date: new Date(),
					detail: "HAHAHA"
				},
				{
					from: "Windi",
					subject: "Subject1",
					date: new Date(),
					detail: "HAHAHA"
				},
			]
		}
	]
};

function genContViewReducer(state = initialState, action) {
	switch (action.type) {
		case ADD_PROJECT:
			return Object.assign({}, state, {
				projects: state.projects.concat(action.payload)
			});
		case SET_SELECTED_PROJECT:
			return Object.assign({}, state, {
				selectedProject: action.payload
			});
		case SET_CUR_TAB_POS:
			return Object.assign({}, state, {
				curTabPos: action.payload
			});
		case SET_SELECTED_PROPOSAL:
			return Object.assign({}, state, {
				selectedProposal: action.payload
			});
		default:
			return state;
	}
}

export default genContViewReducer;