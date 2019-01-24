export const INIT_MODEL = 'INIT_MODEL'
export const UPDATE_NODE = 'UPDATE_NODE'
export const UPDATE_EDGE = 'UPDATE_EDGE'
export const UPDATE_CONNECTOR = 'UPDATE_CONNECTOR'
export const UPDATE_CANVAS_OFFSET = 'UPDATE_CANVAS_OFFSET'
export const DESELECT_ALL = 'DESELECT_ALL'
export const DESELECT_OBJECT = 'DESELECT_OBJECT'
export const SELECT_OBJECT = 'SELECT_OBJECT'

const HISTORY = 'history/'
export const PUSH_STATE = HISTORY + 'PUSH_STATE'

export const MAX_HISTORY = 100
const state = {
  model: [],
  connectors: {},
  selectedObjects: [],
  canvas: {
    left: 0,
    top: 0
  }
}
const getters = {
  getConnector: (state) => (id) => {
    return state.connectors[id]
  },
  isSelectedObject: (state) => (object) => {
    return state.selectedObjects.indexOf(object) !== -1
  },
  isEditObject: (state) => (object) => {
    return state.selectedObjects.length === 1 &&
    state.selectedObjects.indexOf(object) !== -1
  }
}
// actions
const actions = {
  async initModel ({ commit }, model) {
    await commit(INIT_MODEL, model)
    await commit(PUSH_STATE, model, { root: true })
  },
  async updateNode ({commit}, {node, newNode, isPushState}) {
    await commit(UPDATE_NODE, {node, newNode})
    if (isPushState) {
      commit(PUSH_STATE, state.model, { root: true })
    }
  },
  async updateEdge ({commit}, {edge, newEdge, isPushState}) {
    await commit(UPDATE_EDGE, {edge, newEdge})
    if (isPushState) {
      commit(PUSH_STATE, state.model, { root: true })
    }
  },
  async updateSelecctedObjects ({dispatch, commit}, {object, ctrlKey}) {
    if (ctrlKey) {
      await dispatch('toggleSelectedObject', object)
    } else {
      commit(DESELECT_ALL)
      commit(SELECT_OBJECT, object)
    }
  },
  async toggleSelectedObject ({commit, getters}, object) {
    if (getters.isSelectedObject(object)) {
      commit(DESELECT_OBJECT, object)
    } else {
      commit(SELECT_OBJECT, object)
    }
  }
}

// mutations
const mutations = {
  [INIT_MODEL] (state, model) {
    state.model = model
  },
  [UPDATE_NODE] (state, {node, newNode}) {
    let index = state.model.nodes.indexOf(node)
    if (newNode) {
      Object.assign(state.model.nodes[index], newNode)
    } else {
      state.model.nodes.splice(index, 1)
    }
  },
  [UPDATE_EDGE] (state, {edge, newEdge}) {
    let index = state.model.edges.indexOf(edge)
    if (newEdge) {
      Object.assign(state.model.edges[index], newEdge)
    } else {
      state.model.edges.splice(index, 1)
    }
  },
  [UPDATE_CONNECTOR] (state, {connectorId, x, y}) {
    if (state.connectors[connectorId]) {
      state.connectors[connectorId].x = x
      state.connectors[connectorId].y = y
    } else {
      this._vm.$set(state.connectors, connectorId, {x, y})
    }
  },
  [UPDATE_CANVAS_OFFSET] (state, {left, top}) {
    state.canvas.left = left
    state.canvas.top = top
  },
  [DESELECT_ALL] (state) {
    state.selectedObjects.splice(0, state.selectedObjects.length)
  },
  [SELECT_OBJECT] (state, object) {
    if (state.selectedObjects.indexOf(object) === -1) {
      state.selectedObjects.push(object)
    }
  },
  [DESELECT_OBJECT] (state, object) {
    let index = state.selectedObjects.indexOf(object)
    if (index === -1) {
      throw new Error('Tried to deselect an unselected object')
    }
    state.selectedObjects.splice(index, 1)
  }

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
