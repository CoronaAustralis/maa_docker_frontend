<template>

  <div class="flex items-center h-12 w-32 mr-0 m-auto justify-center gap-x-4 sm:mr-20">
    <div class="hover:bg-gray-200 hover:opacity-100 rounded-lg opacity-50 btn" title="强行结束当前任务簇"
      @click.stop="forceStopRunningTask">
      <i class="pi pi-times align-bottom m-2" style="font-size: 1rem"></i>
    </div>
    <div class="hover:bg-gray-200 hover:opacity-100 rounded-lg opacity-50 btn" title="重置到template"
      @click.stop="viewToTemplate">
      <i class="pi pi-sync align-bottom m-2" style="font-size: 1rem"></i>
    </div>
    <div class="hover:bg-gray-200 hover:opacity-100 rounded-lg opacity-50 btn" title="设置"
      @click.stop="settingVisible = true">
      <i class="pi pi-cog align-bottom m-2" style="font-size: 1rem"></i>
    </div>
    <div class="hover:bg-gray-200 hover:opacity-100 rounded-lg opacity-50 btn" title="邮件提醒" @click.stop="openEmailPush">
      <i class="pi pi-envelope align-bottom m-2" style="font-size: 1rem"></i>
    </div>
  </div>
  <div class="container hidden sm:block sm:mx-auto">
    <a href="https://github.com/CoronaAustralis/maa_docker" target="_blank" class="github-corner"
      aria-label="View source on GitHub"><svg width="3rem" height="3rem" viewBox="0 0 250 250"
        style="fill:#000000; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true">
        <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
        <path
          d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
          fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
        <path
          d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
          fill="currentColor" class="octo-body"></path>
      </svg></a>
  </div>

  <div>
    <Dialog v-model:visible="settingVisible" modal header="设置" :style="{ width: '40%' }">
      <SettingView @close="settingVisible = false"></SettingView>
    </Dialog>
    <Dialog v-model:visible="emailPushVisible" modal header="邮件推送" :style="{ width: '40%' }">
      <div class="card flex justify-center">
        <Form v-slot="$form" class="flex flex-col gap-4 w-full sm:w-56" :initialValues="initialValues"
          @submit="updateEmailPush">
          <div class="flex flex-col gap-1">
            <InputText name="host" type="text" placeholder="smtp.qq.com" fluid />
            <Message v-if="$form.host?.invalid" severity="error" size="small" variant="simple">{{ $form.host.error.message }}</Message>
          </div>
          <div class="flex flex-col gap-1">
            <InputText name="port" type="number" placeholder="端口" fluid />
          </div>
          <div class="flex flex-col gap-1">
            <InputText name="email_address" type="text" placeholder="邮箱地址" fluid />
          </div>
          <div class="flex flex-col gap-1">
            <InputText name="token" type="text" placeholder="token" fluid />
          </div>
          <div class="flex justify-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="emailPushVisible = false"></Button>
            <Button type="submit" severity="secondary" label="Save" />
          </div>
        </Form>
      </div>

    </Dialog>
    <!-- <Test/> -->
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@/stores/store';
import { Form } from '@primevue/forms';


const store = useStore();

const settingVisible = ref(false);
const emailPushVisible = ref(false);
const viewToTemplate = () => {
  console.log('viewToTemplate')
  if (store.templateCluster?.hash) {
    store.currentClusterHash = "template"
  }
}

const forceStopRunningTask = () => {
  api.ForceStopRunningTask().then(() => {
    store.runningTaskHash = ''
  })
}

const initialValues = ref({
  "port": 465,
  "host": "smtp.example.com",
  "email_address": "",
  "token": ""
})

const openEmailPush = () => {
  api.UpdateEmailPush({}).then((res) => {
    if(res.data.data.email_address != ""){
      initialValues.value = res.data.data
    }
    emailPushVisible.value = true
  })
}
const updateEmailPush = (e: any) => {
  e.values.port = parseInt(e.values.port)
  api.UpdateEmailPush(e.values).then(()=>{
  emailPushVisible.value = false
  })
}

// api.CheckGame().then((res) => {
//     if (res.data.code == 0) {
//         toast.info(res.data.msg)
//     }
// })

const getRunningTask = () => {
  api.GetRunningTask().then((res) => {
    if (store.runningTaskHash != res.data.taskCluster) {
      store.runningTaskHash = res.data.taskCluster
    }
  })
}

getRunningTask()
setInterval(getRunningTask, 3000)

</script>

<style lang='css' scoped></style>
