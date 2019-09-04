//

import {Axios} from '../utils/AxiosPlugin'

const savePage = async function (data) {
  return await Axios.post('/page/savePage', {data: JSON.stringify(data)});
};

const getPagesByProjectId = async function (projectId) {
  return await Axios.get('/page/getPagesByProjectId', {params: {projectId: projectId}});
};

const updatePage = async function (data) {
  return await Axios.post('/page/updatePage', {data: JSON.stringify(data)});
};

const updatePageLayout = async function (pageId, layout) {
  return await Axios.post('/page/updatePageLayout', {pageId: pageId, layout: JSON.stringify(layout)});
};

const deletePage = async function (id) {
  return await Axios.delete('/page/deletePage', {params: {id: id}});
};

const getPageById = async function (id) {
  return await Axios.get('/page/getPageById', {params: {id: id}});
};

const getAllPage = async function () {
  return await Axios.get('/page/getAllPage');
};

const getAllPageByProjectId = async function (projectId) {
  return await Axios.get('/page/getAllPageByProjectId', {params: {projectId: projectId}});
};

export default {
  savePage,
  getPagesByProjectId,
  updatePage,
  updatePageLayout,
  deletePage,
  getPageById,
  getAllPage,
  getAllPageByProjectId
}
