import { createActions } from 'redux-actions';
import {
	ALL_PROJECT_LOADED,
	CLEAR_ALL_PROJECTS,
	CLEAR_PROJECTS,
	CLEAR_TEMPLATES,
	PROJECT_LOADED,
	PROJECT_INVITED_LOADED,
} from '../constants/gen-action-types';
import ProjApi from '../api/project';
import ContApi from '../api/contractor';
import PropApi from '../api/proposal';

export const {
	clearProjects,
	clearTemplates,
} = createActions({
	[CLEAR_PROJECTS]: () => null,
	[CLEAR_TEMPLATES]: () => null,
});

const {
	allProjectLoaded,
	clearAllProjects,
	projectLoaded,
} = createActions({
	[ALL_PROJECT_LOADED]: projects => projects,
	[CLEAR_ALL_PROJECTS]: () => null,
	[PROJECT_LOADED]: projects => projects,
})

const invitedLoaded = invited => ({
	type: PROJECT_INVITED_LOADED,
	payload: invited
});

export const addProject = (cont_id, project) => dispatch => ContApi.addProject(cont_id, project).then(data => data.id);
export const updateProject = (id, project) => dispatch => ProjApi.update(id, project);
export const addFilesToProject = (id, files) => dispatch => ProjApi.addFiles(id, files);
export const deleteProject = id => dispatch => ProjApi.delete(id);
export const archiveProject = id => dispatch => ProjApi.archive(id);

export const deleteFileFromProject = (id, name) => dispatch => ProjApi.deleteFile(id, name);

export const getAllProjects = (page, size) => dispatch => {
	dispatch(clearAllProjects());
	return ProjApi.getAll(page, size).then(data => {
		dispatch(allProjectLoaded(data));
	});
};
export const getProjectsByGenId = (id, page, size) => dispatch => ContApi.getProjects(id, page, size).then(data => {
	dispatch(projectLoaded(data));
});
export const getArchivedProjectsByGenId = (id, page, size) => dispatch => ContApi.getProjects(id, page, size, 'ARCHIVED').then(data => {
	dispatch(projectLoaded(data));
});

export const inviteContractor = (id, contid) => ProjApi.invite(id, contid);
export const getInvitedBidders = (id, page, size) => dispatch => {
	return ProjApi.getInvites(id, page, size).then(data => {
		dispatch(invitedLoaded(data));
	});
}

export const addTemplate = (projectId, templateId) => dispatch => ProjApi.addTemplate(projectId, templateId);
export const deleteTemplate = (projectId, templateId) => dispatch => ProjApi.deleteTemplate(projectId, templateId);

export const awardProject = id => dispatch => PropApi.award(id);