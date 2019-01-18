<template>
  <div
    ref="node"
    :id="node.id"
    :draggable="!node.readonly"
    :style="styleComputed"
    :class="classComputed"
    @dblclick="handleDoubleClick"
    @mousedown.stop="handleMousedown"
    v-on="listenersComputed">
    <div :class="flowchartConstants.nodeOverlayClass" />
    <div class="innerNode">
      <p>{{ node.name }}</p>

      <div :class="flowchartConstants.leftConnectorClass">
        <fc-magnet
          v-for="connector in modelservice.nodes.getConnectorsByType(node, flowchartConstants.leftConnectorType)"
          :key="connector.id"
          fc-magnet>
          <fc-connector
            :connector="connector"
            :modelservice="modelservice"/>
        </fc-magnet>
      </div>
      <div :class="flowchartConstants.rightConnectorClass">
        <fc-magnet
          v-for="connector in modelservice.nodes.getConnectorsByType(node, flowchartConstants.rightConnectorType)"
          :modelservice="modelservice"
          :key="connector.id"
        >
          <fc-connector
            :connector="connector"
            :modelservice="modelservice"/>
        </fc-magnet>
      </div>
    </div>
    <div
      v-if="modelservice.isEditable() && !node.readonly"
      class="fc-nodeedit"
      @click="handleEdit">
      #
    </div>
    <div
      v-if="modelservice.isEditable() && !node.readonly"
      class="fc-nodedelete"
      @click="handleDelete">
      &times;
    </div>
  </div>

</template>
<script>
import flowchartConstants from '@/config/flowchart'
import FcMagnet from '@/components/FcMagnet'
import FcConnector from '@/components/FcConnector'
import NodedraggingFactory from '@/service/nodedragging'
import { mapActions } from 'vuex'
export default {
  components: {
    'fc-magnet': FcMagnet,
    'fc-connector': FcConnector
  },
  props: {
    automaticResize: {
      type: Boolean,
      default: false
    },
    dragAnimation: {
      type: String,
      default: 'repaint'
    },
    fcCallbacks: {
      type: Object,
      default: () => {
        return {}
      }
    },
    callbacks: {
      type: Object,
      default: () => {
        return {}
      }
    },
    node: {
      type: Object,
      default: () => {
        return {}
      }
    },
    selected: {
      type: Boolean,
      default: false
    },
    edit: {
      type: Boolean,
      default: false
    },
    underMouse: {
      type: Boolean,
      default: false
    },
    mouseOverConnector: {
      type: Boolean,
      default: false
    },
    modelservice: {
      type: Object,
      default: () => {
        return {}
      }
    },
    draggedNode: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      flowchartConstants: flowchartConstants,
      nodedraggingservice: null
    }
  },
  computed: {
    listenersComputed () {
      if (!this.node.readonly) {
        return {
          dragstart: this.handleDragstart,
          drag: this.handleDragging,
          dragend: this.handleDragend,
          click: this.handleClick,
          mouseover: this.handleMouseover,
          mouseout: this.handleMouseout
        }
      } else {
        return {}
      }
    },
    styleComputed () {
      return {
        position: 'absolute',
        top: this.node.y + 'px',
        left: this.node.x + 'px'
      }
    },
    classComputed () {
      let classObj = {}
      classObj[flowchartConstants.selectedClass] = this.selected
      classObj[flowchartConstants.editClass] = this.edit
      classObj[flowchartConstants.hoverClass] = this.underMouse
      classObj[flowchartConstants.draggingClass] = this.draggedNode
      classObj[flowchartConstants.nodeClass] = true
      return classObj
    }
  },
  created () {
    this.nodedraggingservice = NodedraggingFactory(this.modelservice, {}, null, this.automaticResize, this.dragAnimation)
  },
  mounted () {
    this.modelservice.nodes.setHtmlElement(this.node.id, this.$refs.node)
  },
  methods: {
    ...mapActions('flow', ['updateNode']),
    handleMousedown () {
      console.log('mousedown:', event)
    },
    handleDoubleClick () {

    },
    handleDragstart () {
      console.log('node Dragstart:', event)
      // this.nodedraggingservice.dragstart(event)
      let dataTransfer = event.dataTransfer
      dataTransfer.dropEffect = 'move'
      dataTransfer.setDragImage(this.$el, 40, 40)
      this.$emit('node-dragstart', this.node)
    },
    handleDragging () {
      let newNode = Object.assign(this.node, {
        x: event.clientX,
        y: event.clientY
      })
      this.updateNode({
        node: this.node,
        newNode
      })
    },
    handleDragend () {
      console.log('node Dragend:', event)
      let newNode = Object.assign(this.node, {
        x: event.clientX,
        y: event.clientY
      })
      this.updateNode({
        node: this.node,
        newNode,
        isPushState: true
      })
      this.$emit('node-dragend', event)
    },
    handleClick () {
      this.modelservice.edges.handleEdgeMouseClick(this.node, event.ctrlKey)
      // Don't let the chart handle the mouse down.
      event.stopPropagation()
      event.preventDefault()
    },
    handleMouseover () {

    },
    handleMouseout () {

    },
    handleEdit () {
      let name = prompt('编辑节点名称', this.node.name)
      let newNode = Object.assign(this.node, {
        name
      })
      this.updateNode({
        node: this.node,
        newNode,
        isPushState: true
      })
      this.$emit('node-edit', this.node)
    },
    handleDelete () {
      this.modelservice.nodes.delete(this.node)
    }
  }
}
</script>
<style>
.button-overlay {
  position: absolute;
  top: 40px;
  z-index: 10;
}

.button-overlay button {
  display: block;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 10px;
  border: none;
  box-shadow: none;
  color: #fff;
  font-size: 20px;
  background-color: #f15b26;
}

.button-overlay button:hover:not(:disabled) {
  border: 4px solid #b03911;
  border-radius: 5px;

  margin: -4px;
  margin-bottom: 11px;
}

.button-overlay button:disabled {
  -webkit-filter: brightness(70%);
  filter: brightness(70%);
}

.fc-node {
  z-index: 1;
}

.innerNode {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 50px;
  border-radius: 5px;

  background-color: #f15b26;
  color: #fff;
  font-size: 16px;
  pointer-events: none;
}

.fc-node .fc-node-overlay {
  position: absolute;
  pointer-events: none;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #000;
  opacity: 0;
}

.fc-node.fc-hover .fc-node-overlay {
  opacity: 0.25;
  transition: opacity 0.2s;
}

.fc-node.fc-selected .fc-node-overlay {
  opacity: 0.25;
}

.fc-node.fc-dragging {
  z-index: 10;
}

.fc-node p {
  padding: 0 15px;
  text-align: center;
}

.fc-leftConnectors,
.fc-rightConnectors {
  position: absolute;
  top: 0;
  height: 100%;

  display: flex;
  flex-direction: column;

  z-index: -10;
}

.fc-leftConnectors {
  left: -20px;
}

.fc-rightConnectors {
  right: -20px;
}

.fc-magnet {
  display: flex;
  flex-grow: 1;
  height: 60px;

  justify-content: center;
}

.fc-leftConnectors .fc-magnet {
  align-items: center;
}

.fc-rightConnectors .fc-magnet {
  align-items: center;
}

.fc-connector {
  width: 18px;
  height: 18px;

  border: 10px solid transparent;
  -moz-background-clip: padding; /* Firefox 3.6 */
  -webkit-background-clip: padding; /* Safari 4? Chrome 6? */
  background-clip: padding-box;
  border-radius: 50% 50%;
  background-color: #f7a789;
  color: #fff;
  pointer-events: all;
}

.fc-connector.fc-hover {
  background-color: #000;
}

</style>