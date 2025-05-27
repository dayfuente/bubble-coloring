import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGraphStore = defineStore('graph', () => {
  // Estado
  const graphData = ref(null)
  const colorAssignments = ref({})
  const selectedInstance = ref('')
  const selectedNode = ref(null)
  const showColorPicker = ref(false)
  const validationError = ref('')

  // Computadas
  const nodes = computed(() => {
    if (!graphData.value) return []
    const nodeSet = new Set()
    const pairs = graphData.value.pairs || []
    pairs.forEach(link => {
      nodeSet.add(link.n1)
      nodeSet.add(link.n2)
    })
    return Array.from(nodeSet).map(id => ({ id }))
  })

  const edges = computed(() => graphData.value?.links || [])

  const totalColors = computed(() => {
    return new Set(Object.values(colorAssignments.value)).size
  })

  // Métodos
  async function loadInstance(instanceName) {
    try {
      const [input, output] = await Promise.all([
        fetch(`/instances/${instanceName}/input.json`).then(r => {
          if (!r.ok) throw new Error(`Error ${r.status} al cargar input.json`)
          return r.json()
        }),
        fetch(`/instances/${instanceName}/output.json`).then(r => {
          if (!r.ok) throw new Error(`Error ${r.status} al cargar output.json`)
          return r.json()
        })
      ])
      
      if (!output?.assignment) {
        throw new Error("El archivo output.json no tiene la estructura esperada")
      }

      graphData.value = input
      colorAssignments.value = output.assignment.reduce((acc, curr) => {
        acc[curr.node] = curr.color
        return acc
      }, {})
      
      validationError.value = ''
    } catch (error) {
      console.error("Error loading instance:", error)
      validationError.value = `Error al cargar la instancia: ${error.message}`
    }
  }

  function validate() {
    if (!graphData.value) return
    
    const invalidLinks = edges.value.filter(edge => {
      return colorAssignments.value[edge.n1] === colorAssignments.value[edge.n2]
    })
    
    validationError.value = invalidLinks.length > 0
      ? `Solución inválida: ${invalidLinks.length} enlaces conectan nodos con el mismo color`
      : ''
  }

  function updateColor(node, color) {
    colorAssignments.value = { ...colorAssignments.value, [node]: color }
    validate()
  }

  function downloadSolution() {
    if (!graphData.value) return
    
    const output = {
      assignment: Object.entries(colorAssignments.value).map(([node, color]) => ({
        node: parseInt(node),
        color
      }))
    }
    
    const blob = new Blob([JSON.stringify(output, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedInstance.value}_solution.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    graphData,
    colorAssignments,
    selectedInstance,
    selectedNode,
    showColorPicker,
    validationError,
    nodes,
    edges,
    totalColors,
    loadInstance,
    validate,
    updateColor,
    downloadSolution
  }
})