<!-- *** -->
<template>
    <div v-if="!store.profiles">
        <div class="card flex flex-col justify-center h-48">
            <ProgressSpinner class="h-full" v-if="isGetProfiles" />
            <div v-else class="text-center h-full ">
                <div class="h-1/2 flex items-center justify-center">
                    未获取到数据
                </div>
                <Button label="重试" @click="clickToGetProfiles" icon="pi pi-refresh" />
            </div>
        </div>
    </div>
    <div v-else>
        <div>
            <Textarea v-model="textAreaValue" @input="handleInput" autoResize rows="5" class="w-full" />
            <div class="flex justify-end gap-4 ">
            <Button severity="secondary" label="取消" @click="()=>{emit('close')}"></Button>
            <Button type="submit" severity="success" label="确定" @click="submitProfiles"></Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/stores/store';
import _ from 'lodash';
import Toast from 'primevue/toast';
import { useToast } from 'vue-toastification';

const toast = useToast()
const store = useStore();
const emit = defineEmits(["close"])

const isGetProfiles = ref(false)

const textAreaValue = ref('')

const handleInput = (event:any)=>{

}

onMounted(() => {
    clickToGetProfiles()
})

const clickToGetProfiles = () => {
    isGetProfiles.value = true
    api.GetProfiles().then((res) => {
        store.profiles = res.data.content
        textAreaValue.value = res.data.content
        isGetProfiles.value = false
    }).catch(() => {
        isGetProfiles.value = false
    })
}

const submitProfiles = () => {
    if ((textAreaValue.value == store.profiles) || (textAreaValue.value == '')) {
        emit('close')
        return
    }
    const val = textAreaValue.value
    api.UpdateProfiles({ content: textAreaValue.value }).then(() => {
        store.profiles = val
        api.CheckGame().then((res) => {
            if (res.data.code == 0) {
                toast.info(res.data.msg)
            }
        })
        emit('close')
    })
}
</script>

<style lang='css' scoped></style>