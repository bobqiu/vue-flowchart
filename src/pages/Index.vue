<template>
  <div class="fc-container">
    <div class="fc-left-pane">
      <fc-canvas
        :model="dropSourceModel"
        :automatic-resize="false"
        drop-target-id="fc-target-canvas"
      />
    </div>
    <div
      class="fc-divider"
      style="background-color: gray;"/>
    <div class="fc-right-pane">
      <div class="button-overlay">
        <el-button
          type="primary"
          title="Add a new node to then chart"
          @click="addNewNode()">Add Node
        </el-button>
        <el-button
          type="danger"
          title="Delete selected nodes and connections"
          @click="deleteSelected">
          Delete Selected
        </el-button>
        <el-button
          type="info"
          @click="selectAll()">
          Select All
        </el-button>
        <el-button
          type="primary"
          @click="handleCopy()">
          Copy
        </el-button>

        <el-button
          type="primary"
          @click="handlePaste()">
          Paste
        </el-button>
        <el-button
          :disabled="!hasUndo"
          type="warning"
          @click="handleUndo()">
          Undo
        </el-button>
        <el-button
          :disabled="!hasRedo"
          type="warning"
          @click="handleRedo()">
          Redo
        </el-button>
      </div>
      <fc-canvas
        ref="fcCanvas"
        :model="model"
        :node-add-callback="nodeAddCallback"
        :edge-add-callback="edgeAddCallback"
        edge-style="curved"
        @has-undo="handleHasUndo"
        @has-redo="handleHasRedo"
      />
    </div>
  </div>

</template>

<script>
// import EdgedrawingService from '@/service/edgedrawing'
import flowchartConstants from '@/config/flowchart'
import FcCanvas from '@/components/FcCanvas'
export default {
  name: 'HelloWorld',
  components: {
    'fc-canvas': FcCanvas
  },
  data () {
    let dropSourceModel = {
      nodes: [],
      edges: []
    }
    for (let i = 0; i < 10; i++) {
      let node = {
        name: 'type' + i,
        id: 10000 + i,
        x: 50,
        y: 100 * (i + 1),
        connectors: {
          [flowchartConstants.leftConnectorType]: {
            id: i * 2 + 10000
          },
          [flowchartConstants.rightConnectorType]: {
            id: i * 2 + 1 + 10000
          }
        }
      }
      dropSourceModel.nodes.push(node)
    }
    return {
      dropSourceModel: dropSourceModel,
      model: null,
      hasUndo: false,
      hasRedo: false
    }
  },
  computed: {

  },
  mounted () {
    // 模拟数据获取
    setTimeout(() => {
      this.model = {
        nodes: [{
          id: 1,
          name: 'root',
          x: 120, // x-coordinate of the node relative to the canvas.
          y: 400,
          readonly: true,
          connectors: {
            [flowchartConstants.rightConnectorType]: {
              id: 11
            }
          },
          addition: {
            desc: '这是根节点'
          }
        }, {
          id: 2,
          name: 'node1',
          x: 411, // x-coordinate of the node relative to the canvas.
          y: 200,
          connectors: {
            [flowchartConstants.leftConnectorType]: {
              id: 12
            },
            [flowchartConstants.rightConnectorType]: {
              id: 13
            }
          }
        }, {
          id: 3,
          name: 'node2',
          x: 800, // x-coordinate of the node relative to the canvas.
          y: 500,
          connectors: {
            [flowchartConstants.leftConnectorType]: {
              id: 14
            }
          }
        }],
        edges: [{
          source: 11,
          destination: 12,
          active: false,
          label: 'label0'
        }, {
          source: 13,
          destination: 14,
          active: true,
          label: 'label1'
        }]
      }
    }, 1000)
  },
  methods: {
    nodeAddCallback (name) {
      return new Promise((resolve, reject) => {
        let newName = prompt('新增节点', name)
        if (newName === null) {
          reject(new Error('cancel'))
        } else {
          resolve(newName)
        }
      })
    },
    edgeAddCallback () {
      return new Promise((resolve, reject) => {
        let newName = prompt('新增连线', '')
        if (newName === null) {
          reject(new Error('cancel'))
        } else {
          resolve(newName)
        }
      })
    },
    selectAll () {
      let fcCanvas = this.$refs.fcCanvas
      fcCanvas.store.selectAll()
    },
    addNewNode () {
      let fcCanvas = this.$refs.fcCanvas
      let node = {}
      node.name = prompt('新增节点')
      if (node.name !== null) {
        fcCanvas.store.addNode({node, isPushState: true})
      }
    },
    deleteSelected () {
      let fcCanvas = this.$refs.fcCanvas
      fcCanvas.store.deleteSelected(true)
    },
    handleCopy () {
      let fcCanvas = this.$refs.fcCanvas
      fcCanvas.store.copyData()
    },
    handlePaste () {
      let fcCanvas = this.$refs.fcCanvas
      fcCanvas.store.pasteData()
    },
    handleUndo () {
      let fcCanvas = this.$refs.fcCanvas
      fcCanvas.store.undo()
    },
    handleRedo () {
      let fcCanvas = this.$refs.fcCanvas
      fcCanvas.store.redo()
    },
    handleHasUndo (val) {
      this.hasUndo = val
    },
    handleHasRedo (val) {
      this.hasRedo = val
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
/* eslint-disable */
body {
  font-family: sans-serif;
  margin: 0;
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100vh;
}
.fc-container {
  display: flex;
  flex: 1;
  flex-direction: row;
}

.fc-left-pane {
  flex: 0.15;
}
.button-overlay {
  position: absolute;
  top: 20px;
  z-index: 10;
}

</style>
