<script setup>
import { getArticleCategory } from '@/api/article.js'
import { ref } from 'vue'

const datalist = ref([])
const getchannel = async () => {
  const res = await getArticleCategory()
  datalist.value = res.data.data
}
getchannel()

// console.log(datalist.value)

defineProps({
  modelValue: {
    type: [Number, String]
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <el-select
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    placeholder="请选择"
    style="width: 200px"
  >
    <el-option
      v-for="item in datalist"
      :key="item.id"
      :label="item.cate_name"
      :value="item.id"
    >
    </el-option>
  </el-select>
</template>
