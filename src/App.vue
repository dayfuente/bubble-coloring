<template>
  <div class="app">
    <el-row>
      <el-col :span="24" class="title-center">
        <h1>BUBBLE TROUBLE</h1>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6" class="center-buttons">
        <div class="controls">
          <el-select
            v-model="store.selectedInstance"
            placeholder="Seleccionar instancia"
            @change="handleChange"
            clearable
            style="width: 300px"
          >
            <el-option
              v-for="instance in instances"
              :key="instance"
              :label="instance"
              :value="instance"
            />
          </el-select>

          <el-button
            @click="store.downloadSolution"
            style="width: 300px; margin-left: 0"
          >
            Descargar solución
          </el-button>

          <div v-if="store.totalColors > 0" class="stats">
            Colores usados: {{ store.totalColors }}
          </div>
        </div>
      </el-col>
      <el-col :span="18">
        <div v-if="store.validationError" class="error">
          {{ store.validationError }}
        </div>

        <GraphVisualization
          v-if="store.graphData"
          :nodes="store.nodes"
          :edges="store.edges"
          :color-assignments="store.colorAssignments"
          :color-map="colorMap"
          @node-clicked="handleNodeClick"
        />

        <ColorPicker
          v-if="store.showColorPicker && store.selectedNode !== null"
          :current-node="store.selectedNode"
          :current-color="store.colorAssignments[store.selectedNode]"
          :max-colors="store.totalColors"
          :color-map="colorMap"
          @color-selected="(color) => store.updateColor(store.selectedNode, color)"
          @close="closeColorPicker"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { useGraphStore } from '@/stores/UseGraphStore'
import GraphVisualization from '@/components/GraphVisualization.vue'
import ColorPicker from '@/components/ColorPicker.vue'

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

const handleChange = value => {
  store.loadInstance(value)
}

const handleNodeClick = nodeId => {
  store.selectedNode = nodeId
  store.showColorPicker = true
}

const closeColorPicker = () => {
  store.showColorPicker = false
  store.selectedNode = null
}
</script>

<style scoped>
.app {
  padding: 5px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.stats {
  margin-top: 10px;
  font-weight: bold;
}

.error {
  color: red;
  margin-bottom: 20px;
}

.center-buttons {
  display: flex;
  justify-content: center;
}

.title-center {
  text-align: center;
  padding-bottom: 20px;
}
</style>
