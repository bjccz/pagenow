<!--响应式布局画布(暂时还没实现)-->

<template>
  <div id="ReactiveLayout" class="reactive-layout-canvas"
       :style="{
        backgroundColor: layout.layoutConfigData.backgroundColor,
        width: layout.layoutConfigData.width,
        height: layout.layoutConfigData.height,
        padding: layout.layoutConfigData.padding
       }" @click.stop="layoutCanvasClick">
    <!--{{layout}}-->
    <Row :style="{marginBottom: '10px'}"
         :gutter="row.gutter"
         v-for="row in layout.layoutConfigData.rows"
         :key="row.id">
      <i-col
          v-for="layoutItem in sortLayoutItemBySort(layoutItemsByRowId(row.id), 'sort')"
          :key="layoutItem.id"
          :span="24/layoutItemsByRowId(row.id).length">
        <div class="reactive-layout-item"
             :class="{
              activeBlack: $store.state.designer.currentSelectLayoutItemId == layoutItem.id &&
                $PnUtil.getContrastYIQ(layout.layoutConfigData.backgroundColor.substring(1,7)) == 'black',
              activeWhite: $store.state.designer.currentSelectLayoutItemId == layoutItem.id &&
                $PnUtil.getContrastYIQ(layout.layoutConfigData.backgroundColor.substring(1,7)) == 'white'
             }"
             :data-id="layoutItem.id"
             :style="{
              height: layoutItem.layoutItemConfigData.height,
              backgroundColor: layoutItem.layoutItemConfigData.backgroundColor,
              padding: layoutItem.layoutItemConfigData.padding
             }"
             @click.stop="layoutItemClick(layoutItem)">
          <FuncCompContainer :location="layoutItem.id" :defaultText="layoutItem.layoutItemConfigData.sort + ''">
            <component :is="layoutItem.component.name" :location="layoutItem.id"></component>
          </FuncCompContainer>
        </div>
      </i-col>
    </Row>
  </div>
</template>

<script>

  import { createHelpers } from 'vuex-map-fields';

  const { mapFields } = createHelpers({
    getterType: 'designer/getField',
    mutationType: 'designer/updateField',
  });

  export default {
    name: 'ReactiveLayoutCanvas',
    data() {
      return {

      }
    },
    mounted() {
      this.registerDrop()
    },
    methods: {
      registerDrop () {
        let _this = this;

        setTimeout(() => {
          // 注册布局块放置监听
          $(".reactive-layout-item").droppable({
            accept: ".comp-card",
            drop: (e, ui) => {
              let layoutItemId = e.target.attributes['data-id'].nodeValue;
              let compName = ui.draggable[0].attributes['data-component'].nodeValue;
              let component = {
                id: this.$PnUtil.uuid(),
                name: compName,
                compConfigData: ''
              };
              const componentsContext = require.context('../../', true, /\.vue$/);

              componentsContext.keys().forEach(fileName => {
                const componentConfig = componentsContext(fileName);

                if(componentConfig.default.name == compName) {
                  const compInst = require('../../'+fileName.slice(2, fileName.length));
                  component.compConfigData = Object.assign({}, compInst.default.attr.configDataTemp)
                }
              });

              this.$store.commit('designer/setRightSidebarFuncCompConfigFormName', '');
              this.$store.commit('designer/addComponentToLayoutItem', {
                layoutItemId: layoutItemId,
                component: component
              })
            }
          });
        }, 100)
      },

      layoutCanvasClick () {
        this.$store.commit('designer/setCurrentSelectLayoutItemId', '');
        this.$store.commit('designer/setRightSidebarLayoutItemConfigFormName', '');
        this.$store.commit('designer/setRightSidebarFuncCompConfigFormName', '')
      },

      layoutItemClick(layoutItem) {
        // 点击布局块的时候，给布局块设置droppable的属性scope为layoutItemScope，
        // 与组件库拖拽对象的scope对应，这样组件库的拖拽对象就可以放置在当前点击的布局块里
        $(".reactive-layout-item").droppable('option', 'scope', '');
        for (let i=0; i<event.path.length; i++) {
          let s = $(event.path[i])[0].className + '';
          if (s.indexOf('reactive-layout-item') != -1) {
            $(event.path[i]).droppable('option', 'scope', 'layoutItemScope');
          }
        }

        // 如果当前点击的布局块没有关联组件，那么就清空rightSidebarFuncCompConfigFormName状态
        if (!layoutItem.component.id) {
          this.$store.commit('designer/setRightSidebarFuncCompConfigFormName', '');
        }
        this.$store.commit('designer/setRightSidebarLayoutItemConfigFormName', 'ReactiveLayoutItemForm');
        this.$store.commit('designer/setCurrentSelectLayoutItemId', layoutItem.id)
      },

      layoutItemsByRowId (rowId) {
        let arr = [];
        this.layout.layoutItems.forEach(item=>{
          if(item.layoutItemConfigData.rowId === rowId) {
            arr.push(item)
          }
        });
        return arr
      },

      sortLayoutItemBySort (array, key) {
        return array.sort(function(a,b) {
          let x = a.layoutItemConfigData[key];
          let y = b.layoutItemConfigData[key];
          return ((x<y)?-1:((x>y)?1:0));
        });
      }
    },
    computed: {
      ...mapFields({
        layout: 'pageMetadata.layout'
      })
    },
    watch: {
      'layout.layoutItems': {
        handler: 'registerDrop',
      }
    }
  }
</script>

<style scoped>
  .reactive-layout-item {

  }

  .reactive-layout-item.activeBlack {
    box-shadow: 0 0 10px #000
  }
  .reactive-layout-item.activeWhite {
    box-shadow: 0 0 10px white
  }
</style>
