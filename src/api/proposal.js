
import Axios from 'axios';

const PROP_API_PATH = process.env.PROJECT_API + 'proposals/';

export default {
    addFiles: (id, files) => {
        const formData = new FormData();
        files.forEach(async (file) => {
            formData.append('file', file);
        });

        return Axios.post(PROP_API_PATH + id + "/files/upload/multiple",
            formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            }).then(response => response.data);
    },
    award: propid => Axios.put(PROP_API_PATH + propid, {
        status: 'AWARDED'
    }).then(res => res.data),
    deleteFile: (id, name) => Axios.delete(PROP_API_PATH + id + "/files/" + name).then(res => res.data),
    getDetail: (id) => Axios.get(PROP_API_PATH + id + '/temCatOptionDetail').then(res => res.data),
    getInfo: id => Axios.get(PROP_API_PATH + id).then(res => res.data),
    delete: id => Axios.delete(PROP_API_PATH + id).then(res => res.data),
    submit: (contId, projId, desc) => Axios.post(process.env.PROJECT_API + "contractors/" + contId + "/projects/" + projId + "/proposals",
        desc).then(res => res.data),
    addOption: (propid, catid, option) => Axios.post(PROP_API_PATH + propid + '/categories/' + catid + '/options', option).then(res => res.data)
}