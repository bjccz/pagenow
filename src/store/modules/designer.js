
import PnUtil from '../../utils/PnUtil'

import PnApi from '../../api/PnApi'

import { getField, updateField } from 'vuex-map-fields';

const state = {

  // 设计器全局配置
  globalConfigData: {
    snapEnabled: false, // 拖拽中是否打开自动对齐

    absolute: { // 针对绝对布局的配置
      defaultLayoutConfigData: { // 绝对布局默认配置（只读，不用于逻辑处理）
        width: '1440px',
        height: '900px',
        backgroundColor: 'antiquewhite'
      }
    },
    reactive: { // 针对响应式布局的配置
      defaultLayoutConfigData: { // 响应式布局默认配置（只读，不用于逻辑处理）
        width: '100%',
        height: '100%',
        backgroundColor: 'antiquewhite',
        padding: '10px',
        rows: []
      }
    }
  },

  // 页面源数据
  pageMetadata: {
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
  },

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


  rightSidebarLayoutItemConfigFormName: '', // 右侧边栏布局块编辑区表单名称
  currentSelectLayoutItemId: '', // 当前选中的布局块ID


  rightSidebarFuncCompConfigFormName: '', // 右侧边栏组件编辑区表单名称
  //currentEditFuncCompId: ''
};

const getters = {
  getField,

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
        layout: JSON.parse(page.layout)
      };
      commit('setPageMetadata', pageMetadataTmp)
    });

  }

};

const mutations = {

  updateField,

  resetDesigner (state) {
    state.rightSidebarLayoutItemConfigFormName = '';
    state.currentSelectLayoutItemId = '';
    state.rightSidebarFuncCompConfigFormName = '';
    state.pageMetadata.layout.layoutItems = [];
  },

  setPageMetadata (state, pageMetadata) {
    state.pageMetadata = pageMetadata
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
   * 添加响应式布局的行对象
   * @param state
   * @param row
   */
  addRow (state, row) {
    state.pageMetadata.layout.layoutConfigData.rows.push(row)
  },

  /**
   *
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
   * 设置响应式布局行配置中的列间隔
   * @param state
   * @param payload
   */
  setRowGutter (state, payload) {
    let obj = state.pageMetadata.layout.layoutConfigData.rows.find(o=>o.id==payload.rowId);
    obj.gutter = payload.gutter
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

  setRightSidebarLayoutItemConfigFormName (state, compName) {
    state.rightSidebarLayoutItemConfigFormName = compName
  },
  setCurrentSelectLayoutItemId (state, layoutItemId) {
    state.currentSelectLayoutItemId = layoutItemId;
  },
  updateLayoutItem (state, field) {
    updateField(state.pageMetadata.layout.layoutItems.find(o=>o.id==state.currentSelectLayoutItemId), field);
  },

  /**
   * 设置右侧边栏组件配置关联的组件表单名
   * @param state
   * @param payload
   */
  setRightSidebarFuncCompConfigFormName (state, payload) {
    state.rightSidebarFuncCompConfigFormName = payload
  },

};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

