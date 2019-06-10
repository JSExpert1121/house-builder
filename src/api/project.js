
import Axios from 'axios';

const PROJ_API_PATH = process.env.PROJECT_API + 'projects/';

export default {
    addFiles: (id, files) => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('file', file);
        });

        return Axios.post(PROJ_API_PATH + id + "/files/upload/multiple",
            formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            }).then(response => response.data);
    },
    deleteFile: (id, name) => Axios.delete(PROJ_API_PATH + id + "/files/" + name).then(res => res.data),
    getInfo: id => Axios.get(PROJ_API_PATH + id).then(res => res.data),
    delete: id => Axios.delete(PROJ_API_PATH + id).then(res => res.data),
    update: (id, proj) => Axios.put(PROJ_API_PATH + id, proj).then(res => res.data),
    getAll: (page, size) => Axios.get(PROJ_API_PATH, {
        params: { 'page': page, 'size': size }
    }).then(res => res.data),
    getProposals: (id, page, size) => Axios.get(PROJ_API_PATH + id + '/proposals', {
        params: { 'page': page, 'size': size }
    }).then(res => res.data),
    addTemplate: (projId, tempId) => Axios.post(PROJ_API_PATH + projId + '/templates/' + tempId).then(res => res.data),
    deleteTemplate: (projId, tempId) => Axios.delete(PROJ_API_PATH + projId + '/templates/' + tempId).then(res => res.data),
}