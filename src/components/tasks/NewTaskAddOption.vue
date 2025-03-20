<!-- *** -->
<template>
      <div>
            <div @click="selectTemplate(ele)" v-for="(ele, index) in data"
                  :style="(ele.no == 0 ? 'border-color:var(--p-panel-border-color)' : 'border-color:rgb(103 232 249);')"
                  class="hover:bg-gray-200 cursor-pointer relative  p-2 m-2 template_container">
                  <div v-if="ele.no != 0" class="absolute border-0 -top-3 -left-3 bg-cyan-300 rounded-full w-6 h-6">
                        <div class="h-full leading-6 text-center">{{ ele.no }}</div>
                  </div>
                  <p class="m-0">
                        {{ ele.name }}
                  </p>
            </div>
      </div>
      <div class="flex">
            <div class="p-2">
                  <Button label="Save" icon="pi pi-check" iconPos="right" size="small" @click="clickToSave" />
            </div>
            <div class="p-2">
                  <Button label="Cancel" icon="pi pi-times" severity="danger" iconPos="right" size="small"
                        @click="clickToCancel" />
            </div>
      </div>
</template>

<script lang="ts" setup>
import { useStore } from "@/stores/store";

const store = useStore()
const emit = defineEmits(['save', 'cancel'])

const data = ref<{ "no": number, "name": string }[]>([])
const flag = ref<boolean[]>([])
store.templateCluster.tasks.forEach((i) => {
      flag.value.push(false)
      data.value.push({
            "no": 0,
            "name": i
      })
})

watch(store.templateCluster.tasks, (newVal, oldVal) => {
      // TOOD
})

const selectTemplate = (ele: { "no": number, "name": string }) => {
      if (ele.no) {
            flag.value[ele.no - 1] = false
            ele.no = 0
      } else {
            for (let i = 0; i < flag.value.length; i++) {
                  if (!flag.value[i]) {
                        flag.value[i] = true
                        ele.no = i + 1
                        break
                  }
            }
      }
}

const clickToSave = () => {
      const tempList: string[] = []
      data.value.forEach((ele) => {
            if (ele.no) {
                  tempList[ele.no - 1] = ele.name
            }
      })
      const finalList = tempList.filter((ele) => ele)
      emit('save', finalList)
}

const clickToCancel = () => {
      emit('cancel')
}
</script>

<style lang='css' scoped>
.template_container {
      border-radius: var(--p-panel-border-radius);
      border: 0.125rem solid;
      box-shadow: none;
}

;
</style>