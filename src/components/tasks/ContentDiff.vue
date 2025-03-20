<!-- *** -->
<template>
<Dialog v-model:visible="visible" modal header="Diff Content" :style="{ width: '90%',height:'90%' }" @hide="emit('close')">
    <Diff
    mode="split"
    theme="light"
    language="plaintext"
    :prev="oldContent"
    :current="newContent"
  />
</Dialog>
</template>

<script lang="ts" setup>

const visible = ref(false)
const emit = defineEmits(["close"])
const props = defineProps({
    "oldContent": String,
    "newContent": String,
    "show":Boolean
})
onUpdated(() => {
  visible.value = props.show
})
</script>

<style lang='css' scoped>

</style>