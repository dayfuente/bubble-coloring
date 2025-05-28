import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import JSZip from 'jszip'

export const useGraphStore = defineStore('graph', () => {
  const graphData = ref(null)
  const colorAssignments = ref({})
  const selectedInstance = ref('')
  const selectedNode = ref(null)
  const showColorPicker = ref(false)
  const validationError = ref('')
  const originalAssignments = ref([])
  const originalInput = ref(null)

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

  const edges = computed(() => graphData.value?.pairs || [])

  const totalColors = computed(() => {
    return new Set(Object.values(colorAssignments.value)).size
  })

  const loadInstance = async instanceName => {
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
      originalInput.value = input
      originalAssignments.value = output.assignment
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

  const updateColor = (node, color) => {
    colorAssignments.value = { ...colorAssignments.value, [node]: color }
  }

  const downloadSolution = () => {
    if (!graphData.value || !originalAssignments.value.length) return

    const modifiedOutput = {
      assignment: Object.entries(colorAssignments.value).map(([node, color]) => ({
        node: parseInt(node),
        color
      }))
    }

    const originalOutput = {
      assignment: originalAssignments.value
    }

    const zip = new JSZip()

    zip.file('input.json', JSON.stringify(originalInput.value, null, 2))
    zip.file('original_output.json', JSON.stringify(originalOutput, null, 2))
    zip.file('modified_output.json', JSON.stringify(modifiedOutput, null, 2))

    zip.generateAsync({ type: 'blob' }).then(blob => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${selectedInstance.value}_archivos.zip`
      a.click()
      URL.revokeObjectURL(url)
    })
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
    updateColor,
    downloadSolution
  }
})
