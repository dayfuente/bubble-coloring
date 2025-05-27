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
    graphData.value.links.forEach(link => {
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
        fetch(`/instances/${instanceName}/input.json`).then(r => r.json()),
        fetch(`/instances/${instanceName}/output.json`).then(r => r.json())
      ])
      
      graphData.value = input
      colorAssignments.value = output.reduce((acc, curr) => {
        acc[curr.nodo] = curr.color
        return acc
      }, {})
      validationError.value = ''
    } catch (error) {
      console.error("Error loading instance:", error)
      validationError.value = "Error al cargar la instancia"
    }
  }

  function solve() {
    if (!graphData.value) return
    
    const result = {}
    const nodesByDegree = [...nodes.value].sort((a, b) => {
      const degreeA = edges.value.filter(e => e.n1 === a.id || e.n2 === a.id).length
      const degreeB = edges.value.filter(e => e.n1 === b.id || e.n2 === b.id).length
      return degreeB - degreeA
    })
    
    nodesByDegree.forEach(node => {
      const usedColors = new Set()
      
      edges.value.forEach(edge => {
        if (edge.n1 === node.id && result[edge.n2]) {
          usedColors.add(result[edge.n2])
        }
        if (edge.n2 === node.id && result[edge.n1]) {
          usedColors.add(result[edge.n1])
        }
      })
      
      let color = 1
      while (usedColors.has(color)) {
        color++
      }
      
      result[node.id] = color
    })
    
    colorAssignments.value = result
    validate()
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
    
    const output = Object.entries(colorAssignments.value).map(([nodo, color]) => ({
      nodo: parseInt(nodo),
      color
    }))
    
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
    solve,
    validate,
    updateColor,
    downloadSolution
  }
})