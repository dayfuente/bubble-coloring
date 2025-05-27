<script setup>
import { useGraphStore } from '@/stores/UseGraphStore'
import GraphVisualization from '@/components/GraphVisualization.vue'
import ColorPicker from '@/components/ColorPicker'

const store = useGraphStore()

const instances = ['instance1', 'instance2', 'instance3']

const colorMap = {
  1: '#FF6B6B',
  2: '#4ECDC4',
  3: '#45B7D1',
  4: '#FFBE0B',
  5: '#FB5607',
  6: '#8338EC',
  7: '#3A86FF',
  8: '#FF006E',
}

function handleNodeClick(nodeId) {
  store.selectedNode = nodeId
  store.showColorPicker = true
}

function closeColorPicker() {
  store.showColorPicker = false
  store.selectedNode = null
}
</script>

<template>
  <div class="app">
    <h1>BUBBLE TROUBLE</h1>

    <div class="controls">
      <select v-model="store.selectedInstance" @change="store.loadInstance(store.selectedInstance)">
        <option value="">Seleccionar instancia</option>
        <option v-for="instance in instances" :key="instance" :value="instance">
          {{ instance }}
        </option>
      </select>

      <button @click="store.validate">Validar solución</button>
      <button @click="store.downloadSolution">Descargar solución</button>

      <div v-if="store.totalColors > 0" class="stats">
        Colores usados: {{ store.totalColors }}
      </div>
    </div>

    <div v-if="store.validationError" class="error">
      {{ store.validationError }}
    </div>

    <GraphVisualization v-if="store.graphData" :nodes="store.nodes" :edges="store.edges"
      :color-assignments="store.colorAssignments" :color-map="colorMap" @node-clicked="handleNodeClick" />

    <ColorPicker v-if="store.showColorPicker && store.selectedNode !== null" :current-node="store.selectedNode"
      :current-color="store.colorAssignments[store.selectedNode]" :max-colors="store.totalColors" :color-map="colorMap"
      @color-selected="(color) => store.updateColor(store.selectedNode, color)" @close="closeColorPicker" />
  </div>
</template>