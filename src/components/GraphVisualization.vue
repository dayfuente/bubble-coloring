<script setup>
import { ref, onMounted, watch } from 'vue'
import { DataSet, Network } from 'vis-network'

const props = defineProps({
  nodes: Array,
  edges: Array,
  colorAssignments: Object,
  colorMap: Object
})

const emit = defineEmits(['node-clicked'])

const graphContainer = ref(null)
const network = ref(null)

function drawGraph() {
  if (!graphContainer.value) return
  
  const nodes = new DataSet(
    props.nodes.map(node => ({
      id: node.id,
      label: node.id.toString(),
      color: {
        background: props.colorMap[props.colorAssignments[node.id]] || '#CCCCCC',
        border: '#2B7CE9',
        highlight: {
          background: props.colorMap[props.colorAssignments[node.id]] || '#CCCCCC',
          border: '#FFA500'
        }
      },
      borderWidth: 2,
      shape: 'circle'
    }))
  )
  
  const edges = new DataSet(
    props.edges.map(edge => ({
      from: edge.n1,
      to: edge.n2,
      color: getEdgeColor(edge),
      width: 2,
      smooth: false
    }))
  )
  
  const data = { nodes, edges }
  const options = {
    physics: {
      enabled: true,
      stabilization: {
        iterations: 100
      }
    },
    nodes: {
      size: 20,
      font: {
        size: 14,
        color: '#000000'
      },
      margin: 10
    },
    edges: {
      color: {
        inherit: false
      },
      arrows: {
        to: false
      }
    },
    interaction: {
      hover: true,
      tooltipDelay: 200
    }
  }
  
  if (network.value) {
    network.value.destroy()
  }
  
  network.value = new Network(graphContainer.value, data, options)
  network.value.on('click', params => {
    if (params.nodes.length) {
      emit('node-clicked', params.nodes[0])
    }
  })
}

function getEdgeColor(edge) {
  const color1 = props.colorAssignments[edge.n1]
  const color2 = props.colorAssignments[edge.n2]
  
  if (color1 && color2 && color1 === color2) {
    return { color: '#FF0000', highlight: '#FF0000' }
  }
  return { color: '#CCCCCC', highlight: '#CCCCCC' }
}

onMounted(drawGraph)
watch(() => [props.nodes, props.edges, props.colorAssignments], drawGraph)
</script>

<template>
  <div ref="graphContainer" class="graph-container"></div>
</template>