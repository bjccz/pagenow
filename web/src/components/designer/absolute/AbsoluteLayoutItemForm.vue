<!--布局块数据编辑表单-->

<template>
  <div class="absolute-layout-item-form">

    <Tabs size="small">
      <TabPane label="基础配置">
        <Form :label-width="105">
          <FormItem label="ID">
            <Input size="small" v-model="id" disabled/>
          </FormItem>
          <FormItem label="允许拖拽">
            <i-switch v-model="draggableEnabled">
              <span slot="open"></span>
              <span slot="close"></span>
            </i-switch>
          </FormItem>
          <FormItem label="允许调整大小">
            <i-switch v-model="resizableEnabled">
              <span slot="open"></span>
              <span slot="close"></span>
            </i-switch>
          </FormItem>
          <FormItem label="宽度">
            <!--<Input size="small" v-model="width"/>-->
            <InputNumber size="small" :max="10000" :min="10" v-model="width"></InputNumber> px
          </FormItem>
          <FormItem label="高度">
            <!--<Input size="small" v-model="height"/>-->
            <InputNumber size="small" :max="10000" :min="10" v-model="height"></InputNumber> px
          </FormItem>
          <FormItem label="左偏移">
            <!--<Input size="small" v-model="left"/>-->
            <InputNumber size="small" :max="10000" :min="0" :step="10" v-model="left"></InputNumber> px
          </FormItem>
          <FormItem label="上偏移">
            <!--<Input size="small" v-model="top"/>-->
            <InputNumber size="small" :max="10000" :min="0" :step="10" v-model="top"></InputNumber> px
          </FormItem>
          <FormItem label="边框宽度">
            <InputNumber size="small" :max="10000" :min="0" :step="1" v-model="borderWidth"></InputNumber> px
          </FormItem>
          <FormItem label="边框类型">
            <Select size="small" v-model="borderStyle">
              <Option v-for="item in $PnDict.borderStyles" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="边框颜色">
            <ColorPicker size="small" v-model="borderColor" alpha/>
          </FormItem>

          <FormItem label="背景颜色">
            <ColorPicker size="small" v-model="backgroundColor" alpha/>
          </FormItem>
          <FormItem label="鼠标滑入背景色">
            <ColorPicker size="small" v-model="mouseenterBackgroundColor" alpha/>
          </FormItem>
          <FormItem label="鼠标滑出背景色">
            <ColorPicker size="small" v-model="mouseleaveBackgroundColor" alpha/>
          </FormItem>

          <Divider :style="{fontSize: '13px'}" dashed>边框圆角</Divider>
          <FormItem label="上左">
            <InputNumber size="small" :max="10000" :min="0" :step="1" v-model="borderTopLeftRadius"></InputNumber> px
          </FormItem>
          <FormItem label="上右">
            <InputNumber size="small" :max="10000" :min="0" :step="1" v-model="borderTopRightRadius"></InputNumber> px
          </FormItem>
          <FormItem label="下右">
            <InputNumber size="small" :max="10000" :min="0" :step="1" v-model="borderBottomLeftRadius"></InputNumber> px
          </FormItem>
          <FormItem label="下左">
            <InputNumber size="small" :max="10000" :min="0" :step="1" v-model="borderBottomRightRadius"></InputNumber> px
          </FormItem>
          <Divider dashed/>

          <FormItem label="层级">
            <InputNumber size="small" :max="1000" :min="1" v-model="zIndex"></InputNumber>
          </FormItem>
          <FormItem label="内边距">
            <InputNumber size="small" :max="10000" :min="0" :step="1" v-model="padding"></InputNumber> px
          </FormItem>
          <FormItem label="鼠标悬停样式">
            <Select :transfer="true" size="small" v-model="cursor">
              <Option v-for="item in $PnDict.cursor" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>

          <FormItem label="是否显示">
            <Select :transfer="true" size="small" v-model="display">
              <Option v-for="item in $PnDict.display" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="关联组件">
            <Input size="small" v-model="componentName" disabled/>
          </FormItem>
          <FormItem label="">
            <Button class="m-r-5px" size="small" type="primary"
                    @click="customStyleCodeModalVisible = !customStyleCodeModalVisible">自定义样式</Button>
            <!--<Button class="m-r-5px" size="small" type="primary"
                    @click="copyLayoutItem">复制拷贝</Button>-->
            <!--<Dropdown :transfer="true" trigger="click" placement="bottom-start" @on-click="dropdownClickHandle">
              <Button type="primary" size="small">
                操作
                <Icon type="ios-arrow-down"></Icon>
              </Button>
              <DropdownMenu slot="list">
                <DropdownItem name="customStyle">自定义样式</DropdownItem>
                <DropdownItem name="copyLayoutItem">复制</DropdownItem>
              </DropdownMenu>
            </Dropdown>-->
          </FormItem>

        </Form>
      </TabPane>
      <TabPane label="过渡动画">
        <Form :label-width="105">
          <FormItem label="启用">
            <i-switch v-model="animationVisible">
              <span slot="open"></span>
              <span slot="close"></span>
            </i-switch>
          </FormItem>
          <FormItem label="延时时间">
            <Select size="small" v-model="animationDelay">
              <Option v-for="item in $PnDict.animationDelayClass" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="进场动画">
            <Select size="small" v-model="inAnimation">
              <Option v-for="item in $PnDict.inAnimations" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="出场动画">
            <Select size="small" v-model="outAnimation">
              <Option v-for="item in $PnDict.outAnimations" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Form>
      </TabPane>
    </Tabs>


    <Modal
        v-model="customStyleCodeModalVisible"
        draggable
        scrollable
        title="自定义样式编辑"
        width="650"
        :mask="true"
        :z-index="3">
      <Alert type="info">提示：自定义样式会与预设样式进行浅合并，如果存在相同属性配置，自定义样式会覆盖预设样式</Alert>
      <!--<PnJsonEditor v-model="customStyleCode" :mode="'code'"></PnJsonEditor>-->
      <CodeEditor v-model="customStyleCode" mode="SCSS"></CodeEditor>
      <div slot="footer">
        <Button type="default" @click="customStyleCodeModalVisible = false">关闭</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
  import { createHelpers } from 'vuex-map-fields';

  const { mapFields } = createHelpers({
    getterType: 'designer/getLayoutItem',
    mutationType: 'designer/updateLayoutItem',
  });

  export default {
    name: 'AbsoluteLayoutItemForm',
    data() {
      return {
        customStyleCodeModalVisible: false
      }
    },
    mounted() {

    },
    methods: {

      /*dropdownClickHandle (name) {
        if (name == 'customStyle') {
          this.customStyleCodeModalVisible = !this.customStyleCodeModalVisible
        }
        if (name == 'copyLayoutItem') {
          this.copyLayoutItem()
        }
      },*/

      /**
       * 弃用
       */
      copyLayoutItem () {

        let newLayoutItemConfigData = Object.assign({}, this.layoutItemConfigData);
        newLayoutItemConfigData.left = 0;
        newLayoutItemConfigData.top = 0;
        let newLayoutItem = {
          id: this.$PnUtil.uuid(),
          layoutItemConfigData: newLayoutItemConfigData,
          component: {
            id: '',
            name: '',
            compConfigData: {}
          }
        };
        if(this.componentId) {
          let newComponent = Object.assign({}, this.component);
          newComponent.id = this.$PnUtil.uuid();
          newLayoutItem.component = newComponent
        }

        this.$store.commit('designer/addLayoutItem', newLayoutItem)
      },

      /**
       * 弃用
       */
      selectFuncComp () {
        console.log('selectFuncComp');

        this.componentId = this.$PnUtil.uuid();
        this.componentName = 'Hello';

        const componentsContext = require.context('../../', true, /\.vue$/);

        componentsContext.keys().forEach(fileName => {
          const componentConfig = componentsContext(fileName);

          if(componentConfig.default.name == 'Hello') {
            const compInst = require('../../'+fileName.slice(2, fileName.length));
            this.componentConfigData = Object.assign({}, compInst.default.attr.configDataTemp)
          }
        });

      }
    },
    computed: {
      ...mapFields({
        id: 'id',
        layoutItemConfigData: 'layoutItemConfigData',
        draggableEnabled: 'layoutItemConfigData.draggableEnabled',
        resizableEnabled: 'layoutItemConfigData.resizableEnabled',
        width: 'layoutItemConfigData.width',
        height: 'layoutItemConfigData.height',
        left: 'layoutItemConfigData.left',
        top: 'layoutItemConfigData.top',
        borderWidth: 'layoutItemConfigData.borderWidth',
        borderStyle: 'layoutItemConfigData.borderStyle',
        borderColor: 'layoutItemConfigData.borderColor',

        borderTopLeftRadius: 'layoutItemConfigData.borderTopLeftRadius',
        borderTopRightRadius: 'layoutItemConfigData.borderTopRightRadius',
        borderBottomLeftRadius: 'layoutItemConfigData.borderBottomLeftRadius',
        borderBottomRightRadius: 'layoutItemConfigData.borderBottomRightRadius',

        backgroundColor: 'layoutItemConfigData.backgroundColor',
        mouseenterBackgroundColor: 'layoutItemConfigData.mouseenterBackgroundColor',
        mouseleaveBackgroundColor: 'layoutItemConfigData.mouseleaveBackgroundColor',

        zIndex: 'layoutItemConfigData.zIndex',
        padding: 'layoutItemConfigData.padding',
        cursor: 'layoutItemConfigData.cursor',

        animationVisible: 'layoutItemConfigData.animationVisible',
        animationDelay: 'layoutItemConfigData.animationDelay',
        inAnimation: 'layoutItemConfigData.inAnimation',
        outAnimation: 'layoutItemConfigData.outAnimation',

        display: 'layoutItemConfigData.display',
        customStyleCode: 'layoutItemConfigData.customStyleCode',

        component: 'component',
        componentId: 'component.id',
        componentName: 'component.name',
        componentConfigData: 'component.compConfigData'
      })
    },
    watch: {

    }
  }
</script>

<style scoped>
  .ivu-form-item {
    margin-bottom: 0px;
  }
  .ivu-divider-horizontal {
    margin: 10px 0px 10px 0px;
  }
</style>
