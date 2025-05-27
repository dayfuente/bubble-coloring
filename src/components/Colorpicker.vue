<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentNode: Number,
  currentColor: Number,
  maxColors: Number,
  colorMap: Object
})

const emit = defineEmits(['color-selected', 'close'])

const availableColors = computed(() => {
  return Object.entries(props.colorMap)
    .slice(0, Math.max(props.maxColors + 2, 8))
    .map(([id, hex]) => ({ id: parseInt(id), hex }))
})

function selectColor(colorId) {
  emit('color-selected', colorId)
  emit('close')
}
</script>

<template>
  <div class="color-picker-modal">
    <div class="color-picker-content">
      <h3>Seleccionar color para nodo {{ currentNode }}</h3>
      <div class="color-options">
        <div
          v-for="color in availableColors"
          :key="color.id"
          class="color-option"
          :style="{ backgroundColor: color.hex }"
          :title="`Color ${color.id}`"
          @click="selectColor(color.id)"
        ></div>
      </div>
      <button @click="$emit('close')">Cerrar</button>
    </div>
  </div>
</template>

<style scoped>
.color-picker-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 1px solid black;
  padding: 20px;
  z-index: 1000;
}

.color-picker-content {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.color-option {
  width: 30px;
  height: 30px;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid #999;
}
</style>
