<template>
  <div ref="graphContainer" class="graph-container" style="width: 100%; height: 80vh;"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network'
import 'vis-network/styles/vis-network.css'

const props = defineProps({
  nodes: Array,
  edges: Array,
  colorAssignments: Object,
  colorMap: Object
})

const emit = defineEmits(['node-clicked'])

const graphContainer = ref(null)
const network = ref(null)

const drawGraph = () => {
  if (!graphContainer.value || !props.nodes || !props.edges) return

  try {
    const nodes = new DataSet(
      props.nodes.map(node => ({
        id: node.id,
        label: node.id.toString(),
        color: {
          background: props.colorMap?.[props.colorAssignments?.[node.id]] || '#CCCCCC',
          border: '#2B7CE9',
          highlight: {
            background: props.colorMap?.[props.colorAssignments?.[node.id]] || '#CCCCCC',
            border: '#FFA500'
          }
        },
        borderWidth: 2,
        shape: 'circle'
      }))
    )

    const edges = new DataSet(
      props.edges.map(edge => ({
        from: edge.n1 || edge.from,
        to: edge.n2 || edge.to,
        color: getEdgeColor(edge),
        width: 2,
        smooth: false,
        arrows: { to: false },
        chosen: {
          edge: values => {
            values.width = 5
          }
        }
      }))
    )

    const data = { nodes, edges }
    const options = {
      physics: {
        enabled: false,
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
  } catch (error) {
    console.error('Error drawing graph:', error)
  }
}

const getEdgeColor = edge => {
  const color1 = props.colorAssignments?.[edge.n1]
  const color2 = props.colorAssignments?.[edge.n2]

  if (color1 && color2 && color1 === color2) {
    return { color: '#FF0000', highlight: '#FF0000' }
  }
  return { color: '#CCCCCC', highlight: '#CCCCCC' }
}

onMounted(() => {
  watch(
    () => [props.nodes, props.edges, props.colorAssignments],
    () => drawGraph(),
    { immediate: true }
  )
})
</script>

<style scoped>
.graph-container {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
}
</style>
