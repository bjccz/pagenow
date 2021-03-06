
import PnUtil from '../../utils/PnUtil'

import PnApi from '../../api/PnApi'

import { getField, updateField } from 'vuex-map-fields';

const state = {

  // 工程信息
  projectInfo: {},

  // 页面源数据
  pageMetadata: {
    layout: {
      layoutItems: [

      ]
    }
  },

  /*pageMetadata: {
    id: PnUtil.uuid(),
    name: 'test',
    path: '/test',
    title: '',
    component: '',
    //developCanvas: 'ReactiveLayoutCanvas',
    remark: '',
    layout: {
      id: PnUtil.uuid(),
      layoutConfigData: {
        width: '100%',
        height: '100%',
        backgroundColor: 'antiquewhite',
        padding: '10px',
        rows: [
          // {
          //   id: '88888888',
          //   gutter: 10
          // },
          // {
          //   id: '99999999',
          //   gutter: 16
          // }
        ]
      },

      layoutItems: [
        // {
        //   id: PnUtil.uuid(),
        //   layoutItemConfigData: {
        //     rowId: '88888888',
        //     height: '80px',
        //     backgroundColor: '#66CCFF'
        //   },
        //   component: {
        //     id: '',
        //     name: '',
        //     compConfigData: {
        //
        //     }
        //   }
        // },
        // {
        //   id: PnUtil.uuid(),
        //   layoutItemConfigData: {
        //     rowId: '88888888',
        //     height: '80px',
        //     backgroundColor: '#66CCFF'
        //   },
        //   component: {
        //     id: '',
        //     name: '',
        //     compConfigData: {
        //
        //     }
        //   }
        // }
      ]
    }
  },*/

  /*pageMetadata: {
    id: PnUtil.uuid(),
    name: 'test',
    path: '/test',
    title: '',
    component: '',
    developCanvas: 'AbsoluteLayoutCanvas', // 画布组件名称
    remark: '',
    layout: {
      id: PnUtil.uuid(),
      layoutConfigData: {
        width: '1200px',
        height: '600px',
        backgroundColor: 'antiquewhite'
      },
      layoutItems: [
        {
          id: PnUtil.uuid(),
          layoutItemConfigData: {
            width: '200px',
            height: '300px',
            left: '100px',
            top: '30px',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: '#000',
            backgroundColor: 'red',
            zIndex: '1',
            display: 'block'
          },
          component: {
            id: '',
            name: '',
            compConfigData: {

            }
          }
        }
      ]
    }
  },*/

  rightSidebarPageConfigFormName: '',       // 右侧边栏页面信息编辑表单名称
  rightSidebarLayoutItemConfigFormName: '', // 右侧边栏布局块编辑区表单名称
  currentSelectLayoutItemId: '',            // 当前选中的布局块ID

  rightSidebarFuncCompConfigFormName: '',   // 右侧边栏组件编辑区表单名称

  currentSelectLayoutItemIds: []            // 当前选中的多个布局块的ID数组

};

const getters = {
  getField,

  /**
   * 获取工程信息
   * @param state
   * @returns {state.projectInfo|{}|*|string}
   */
  getProjectInfo (state) {
    return state.projectInfo
  },

  /**
   * 获取页面源数据
   * @param state
   * @returns {state.pageMetadata|{layout}|*|string|EchartCompMixin.computed.pageMetadata|null}
   */
  getPageMetadata (state) {
    return state.pageMetadata
  },

  /**
   * 获取布局块对象，内部根据currentSelectLayoutItemId状态属性来查询匹配的布局块对象
   * @param state
   * @returns {*}
   */
  getLayoutItem (state) {
    return getField(state.pageMetadata.layout.layoutItems.find(o=>o.id==state.currentSelectLayoutItemId))
  },

  /**
   * 根据布局块的ID获取布局块对象
   * @param state
   * @returns {function(*): *}
   */
  getLayoutItemById: (state) => (id) => {
    return state.pageMetadata.layout.layoutItems.find(o=>o.id==id)
  },

  getComponents (state) {
    let layoutItems = state.pageMetadata.layout.layoutItems;
    let components = [];
    layoutItems.forEach((item)=>{
      if(item.component.id) {
        components.push(item.component)
      }
    });
    return components;
  },

  getLayoutConfigFormName (state) {
    if(state.pageMetadata.developCanvas === 'ReactiveLayoutCanvas') {
      return 'ReactiveLayoutConfigDataForm'
    }else if(state.pageMetadata.developCanvas === 'AbsoluteLayoutCanvas') {
      return 'AbsoluteLayoutConfigDataForm'
    }
    return ''
  }

};

const actions = {

  loadPage ({commit}, pageId) {
    PnApi.PageApi.getPageById(pageId).then(result => {
      let page = result.data.data;
      let pageMetadataTmp = {
        id: page.id,
        name: page.name,
        path: page.path,
        title: page.title,
        component: page.component,
        developCanvas: page.developCanvas,
        remark: page.remark,
        create_date: page.create_date,
        layout: JSON.parse(page.layout),
        ownEchartTheme: page.ownEchartTheme,
        echartThemeId: page.echartThemeId
      };

      if(pageMetadataTmp.ownEchartTheme == '1' && pageMetadataTmp.echartThemeId) {
        PnApi.EchartThemeApi.getEchartThemeById(pageMetadataTmp.echartThemeId).then(result=>{
          let echartTheme = result.data.data;
          pageMetadataTmp.echartThemeJsonText = echartTheme.jsonText;
          commit('setPageMetadata', pageMetadataTmp)
        })
      }else {
        commit('setPageMetadata', pageMetadataTmp)
      }
    });

  }

};

const mutations = {

  updateField,

  /**
   * 重置设计器相关状态
   * @param state
   */
  resetDesigner (state) {
    state.rightSidebarLayoutItemConfigFormName = '';
    state.currentSelectLayoutItemId = '';
    state.currentSelectLayoutItemIds = [];
    state.rightSidebarFuncCompConfigFormName = '';
    state.pageMetadata.layout.layoutItems = [];
  },

  setProjectInfo (state, projectInfo) {
    state.projectInfo = projectInfo
  },

  setPageMetadata (state, pageMetadata) {
    state.pageMetadata = pageMetadata
  },

  setLayout (state, layout) {
    state.pageMetadata.layout = layout
  },

  setLayoutConfigData (state, layoutConfigData) {
    state.pageMetadata.layout.layoutConfigData = layoutConfigData
  },

  /**
   * 删除指定布局块绑定的组件
   * @param state
   * @param layoutItemId
   */
  deleteComponentByLayoutItemId (state, layoutItemId) {
    let obj = state.pageMetadata.layout.layoutItems.find(o=>o.id==layoutItemId);
    obj.component = {}
  },

  /**
   * 设置布局块的左和上偏移
   * @param state
   * @param payload
   */
  setLayoutItemLeftAndTop (state, payload) {
    let obj = state.pageMetadata.layout.layoutItems.find(o=>o.id==payload.id);
    obj.layoutItemConfigData.left = payload.left;
    obj.layoutItemConfigData.top = payload.top;
  },

  /**
   * 设置布局块的层级zIndex
   * @param state
   * @param payload
   */
  setLayoutItemZIndex (state, payload) {
    for (let i = 0; i < state.pageMetadata.layout.layoutItems.length; i++) {
      if (state.pageMetadata.layout.layoutItems[i].id == payload.id) {
        state.pageMetadata.layout.layoutItems[i].layoutItemConfigData.zIndex = '2'
      }else {
        state.pageMetadata.layout.layoutItems[i].layoutItemConfigData.zIndex = '1'
      }
    }
  },

  /**
   * 设置布局块的宽度和高度
   * @param state
   * @param payload
   */
  setLayoutItemWidthAndHeight (state, payload) {
    let obj = state.pageMetadata.layout.layoutItems.find(o=>o.id==payload.id);
    obj.layoutItemConfigData.width = payload.width;
    obj.layoutItemConfigData.height = payload.height;
  },

  /**
   * 添加布局块
   * @param state
   * @param layoutItem
   */
  addLayoutItem(state, layoutItem) {
    state.pageMetadata.layout.layoutItems.push(layoutItem)
  },

  /**
   * 删除布局块
   * @param state
   * @param layoutItemId
   */
  deleteLayoutItem(state, layoutItemId) {
    let layoutItems = state.pageMetadata.layout.layoutItems;
    for (let i = 0; i < layoutItems.length; i++) {
      if(layoutItems[i].id === layoutItemId) {
        layoutItems.splice(i, 1);
        i--
      }
    }
  },

  /**
   * 添加响应式布局的行对象
   * @param state
   * @param row
   */
  addRow (state, row) {
    state.pageMetadata.layout.layoutConfigData.rows.push(row)
  },

  /**
   * 删除栅格行
   * @param state
   * @param rowId
   */
  deleteRow (state, rowId) {
    let rows = state.pageMetadata.layout.layoutConfigData.rows;
    rows.splice(rows.findIndex(item => item.id === rowId), 1);
    let layoutItems = state.pageMetadata.layout.layoutItems;
    for (let i = 0; i < layoutItems.length; i++) {
      if(layoutItems[i].layoutItemConfigData.rowId === rowId) {
        layoutItems.splice(i, 1);
        i--
      }
    }
  },

  /**
   * 设置响应式布局行数据
   * @param state
   * @param payload
   */
  setRows (state, payload) {
    state.pageMetadata.layout.layoutConfigData.rows = payload
  },

  /**
   * 设置响应式布局行配置中的列间隔
   * @param state
   * @param payload
   */
  setRowGutter (state, payload) {
    let obj = state.pageMetadata.layout.layoutConfigData.rows.find(o=>o.id==payload.rowId);
    obj.gutter = payload.gutter
  },

  /**
   * 设置响应式布局行配置中的排序字段
   * @param state
   * @param payload
   */
  setRowSort (state, payload) {
    let obj = state.pageMetadata.layout.layoutConfigData.rows.find(o=>o.id==payload.rowId);
    obj.sort = payload.sort
  },

  /**
   * 添加组件到布局块
   * @param state
   * @param payload
   */
  addComponentToLayoutItem (state, payload) {
    let layoutItem = state.pageMetadata.layout.layoutItems.find(o=>o.id==payload.layoutItemId);
    layoutItem.component = payload.component
  },

  /**
   * 设置右侧边栏页面信息编辑表单名称
   * @param state
   * @param payload
   */
  setRightSidebarPageConfigFormName (state, payload) {
    state.rightSidebarPageConfigFormName = payload
  },

  /**
   * 设置右侧边栏布局块配置关联的组件表单名
   * @param state
   * @param compName
   */
  setRightSidebarLayoutItemConfigFormName (state, payload) {
    state.rightSidebarLayoutItemConfigFormName = payload
  },

  /**
   *
   * @param state
   * @param layoutItemId
   */
  setCurrentSelectLayoutItemId (state, layoutItemId) {
    state.currentSelectLayoutItemId = layoutItemId;
  },


  updateLayoutItem (state, field) {
    updateField(state.pageMetadata.layout.layoutItems.find(o=>o.id==state.currentSelectLayoutItemId), field);
  },

  /**
   * 设置 右侧边栏组件配置关联的组件表单名
   * @param state
   * @param payload
   */
  setRightSidebarFuncCompConfigFormName (state, payload) {
    state.rightSidebarFuncCompConfigFormName = payload
  },


  /**
   * 添加 当前选中的多个布局块的ID数组 项
   * @param state
   * @param layoutItemId
   */
  addIdToCurrentSelectLayoutItemIds (state, layoutItemId) {
    state.currentSelectLayoutItemIds.pushNoRepeat(layoutItemId)
  },

  /**
   * 设置 当前选中的多个布局块的ID数组
   * @param state
   * @param layoutItemIds 一个存储布局块ID字符串的数组
   */
  setCurrentSelectLayoutItemIds (state, layoutItemIds) {
    state.currentSelectLayoutItemIds = layoutItemIds
  }

};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

