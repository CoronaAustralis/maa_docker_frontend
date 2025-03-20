<!-- *** -->
<template>
    <div v-if="! store.profiles.Connection.Device">
        <div class="card flex flex-col justify-center h-48">
            <ProgressSpinner class="h-full" v-if="isGetProfiles" />
            <div v-else class="text-center h-full ">
                    <div class="h-1/2 flex items-center justify-center">
                        未获取到数据
                    </div>
                    <Button label="重试" @click="clickToGetProfiles" icon="pi pi-refresh"/>
            </div>
        </div>
    </div>
    <div v-else>
        <Form v-slot="$form" :resolver="resolver" :initialValues="store.profiles" @submit="onFormSubmit"
            class="flex flex-col gap-4 w-full">
            <div class="flex flex-row justify-between items-center">
                <div class="w-1/5">adb设备</div>
                <div class="w-3/5">
                    <InputText name="Connection.Device" type="text" v-model='s_device' fluid />
                    <Message v-if="($form as any).Connection?.Device?.invalid" severity="error" size="small"
                        variant="simple">{{ ($form as any).Connection?.Device?.error.message }}</Message>
                </div>
            </div>
            <div class="flex flex-row justify-between items-center">
                <div class="w-1/5">adb配置</div>
                <div class="w-3/5">
                    <Select name="Connection.Config" v-model="s_config" :options="adbConfig" fluid />
                    <Message v-if="($form as any).Connection?.Config?.invalid" severity="error" size="small"
                        variant="simple">{{ ($form as any).Connection?.Config?.error.message }}</Message>
                </div>
            </div>
            <div class="flex justify-end gap-4 ">
                <Button severity="secondary" label="取消" @click="()=>{emit('close')}"></Button>
                <Button type="submit" severity="success" label="确定"/>
            </div>
        </Form>
    </div>
</template>

<script lang="ts" setup>
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { Form } from '@primevue/forms';
import { useStore } from '@/stores/store';
import { useToast } from 'vue-toastification';

const toast = useToast()
const store = useStore();
const emit = defineEmits(["close"])

const isGetProfiles = ref(false)

const adbConfig = ref([
    "CompatPOSIXShell"
])

onMounted(() => {
    clickToGetProfiles()
})

const s_device = ref("")
const s_config = ref("")

const resolver = ref(zodResolver(
    z.object({
        Connection: z.object({
            AdbPath: z.string().min(1),
            Device: z.string().min(1, { message: 'Device is required.' }),
            Config: z.string().min(1, { message: 'Config is required.' })
        }),
        StaticOptions: z.object({
            CpuOcr: z.boolean()
        }),
        InstanceOptions: z.object({
            TouchMode: z.string(),
            DeploymentWithPause: z.boolean(),
            AdbLiteEnabled: z.boolean(),
            KillAdbOnExit: z.boolean()
        })
    })
));

const clickToGetProfiles = () => {
    isGetProfiles.value = true
    api.GetProfiles().then((res) => {
        store.profiles = res.data.data
        s_device.value = res.data.data.Connection.Device
        s_config.value = res.data.data.Connection.Config
        isGetProfiles.value = false
    }).catch(() => {
        isGetProfiles.value = false
    })
}

const onFormSubmit = ({valid}: { valid: boolean }) => {
if(!valid){
    toast.error('请检查表单')
    return
}
store.profiles.Connection.Device = s_device.value
store.profiles.Connection.Config = s_config.value
let pramas = store.profiles
api.UpdateProfiles(pramas).then((res) => {
    toast.success('更新设置成功')
    toast.info(res.data.data,{timeout: 3000})
}).catch(() => {
    toast.error('更新设置失败')
})
}
</script>

<style lang='css' scoped></style>