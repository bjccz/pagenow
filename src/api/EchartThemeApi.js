import {Axios} from '../utils/AxiosPlugin'

const saveEchartTheme = async function (data) {
  return await Axios.post('/echartTheme/saveEchartTheme', {data: JSON.stringify(data)});
};

const updateEchartTheme = async function (data) {
  return await Axios.post('/echartTheme/updateEchartTheme', {data: JSON.stringify(data)});
};

const getAllEchartTheme = async function () {
  return await Axios.get('/echartTheme/getAllEchartTheme');
};

const getEchartThemeById = async function (id) {
  return await Axios.get('/echartTheme/getEchartThemeById', {params: {id: id}});
};

const deleteEchartTheme = async function (id) {
  return await Axios.delete('/echartTheme/deleteEchartTheme', {params: {id: id}});
};

export default {
  saveEchartTheme,
  updateEchartTheme,
  getAllEchartTheme,
  getEchartThemeById,
  deleteEchartTheme
}
