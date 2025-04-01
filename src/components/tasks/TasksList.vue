<!-- *** -->
<template>
    <div class="mt-4">
        <div class="px-4 flex sm:flex-row gap-4 w-full flex-col">
            <div class="w-full md:w-1/4">
                <Panel
                    :header="store.currentClusterHash == '' ? 'No data' : store.currentClusterHash == 'template' ? 'Template cluster' : store.currentCluster?.alias">
                    <Card>
                        <template #content>
                            <div v-if="store.currentClusterHash == ''">
                            </div>
                            <div v-else-if="store.currentClusterHash == 'template'"
                                :class="(store.currentCluster?.isTaskLoading ? 'loading' : '')">
                                <Card v-for="i in store.templateCluster.tasks" @click="openTask(i)"
                                    :class="(currentTaskName == i ? 'bg-gray-100' : '') + ' mb-2 hover:bg-gray-100 cursor-pointer'">
                                    <template #content>
                                        <div class="flex w-full items-center">
                                            <div>
                                                {{ i }}
                                            </div>
                                        </div>
                                    </template>
                                </Card>
                            </div>
                            <div v-else :class="(store.currentCluster?.isTaskLoading ? 'loading' : '')">
                                <div v-if="store.currentCluster">
                                    <VueDraggable v-model="store.currentCluster.tasks"  @update="onUpdateTasks">
                                        <Card v-for="i in store.currentCluster?.tasks" @click="openTask(i)" :key="i"
                                            :class="(currentTaskName == i ? 'bg-gray-100' : '') + ' mb-2 hover:bg-gray-100 cursor-pointer'">
                                            <template #content>
                                                <div class="flex w-full items-center cursor-pointer">
                                                    <div class="w-1/2">
                                                        <div class="truncate cursor-text" contenteditable
                                                            @click.stop.self="() => { }" @blur="renameTask($event, i)">
                                                            {{ i }}
                                                        </div>
                                                    </div>
                                                    <div class="flex ml-auto">
                                                        <div
                                                            class="hover:bg-gray-200 hover:opacity-100 cursor-pointer rounded-lg opacity-50">
                                                            <i class="pi pi-trash text-sm align-bottom m-2"
                                                                @click.stop="deleteTask(i)"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>
                                        </Card>
                                    </VueDraggable>
                                </div>
                                <Card class="mb-2 hover:bg-gray-100">
                                    <template #content>
                                        <div class="flex flex-row justify-between">
                                            <Button icon="pi pi-plus" class="w-1/3" raised aria-label="Save"
                                                @click.stop="showPopover">
                                            </Button>
                                            <Button :outlined="true" class="w-1/3" label="上传infrast文件"
                                                title="上传infrast文件" @click="uploadInfrastFile" :pt="{
                                                    label: {
                                                        style: {
                                                            'white-space': 'nowrap',
                                                            'overflow': 'hidden',
                                                            'text-overflow': 'ellipsis'
                                                        }
                                                    }
                                                }">
                                            </Button>
                                            <input type="file" accept="*" ref="uploadFile" style="display: none;"
                                                @change="handleFileChange">
                                        </div>
                                        <Popover ref="op">
                                            <NewTaskAddOption @save="newTaskAdd" @cancel="newTaskAddCancel" />
                                        </Popover>
                                    </template>
                                </Card>
                            </div>
                        </template>
                    </Card>
                </Panel>
            </div>
            <div class="grow">
                <Card>
                    <template #content>
                        <div class="flex flex-row h-full">
                            <div class="w-12 text-base" style="padding-top: 9px;">
                                <div class="text-center whitespace-pre-line">{{ lineString }}</div>
                            </div>
                            <div class="grow relative">
                                <div :class="(store.currentCluster.isTaskLoading ? 'loading' : '')">
                                    <Textarea v-model="textAreaValue" @input="handleInput" ref="textArea" autoResize
                                        rows="5" :disabled="currentTaskName == ''" class="w-full" />
                                    <div class="flex justify-end items-center" v-if="currentTaskName != ''">
                                        <div
                                            v-if="store.clusterContent[store.currentClusterHash][currentTaskName].oldContent != store.clusterContent[store.currentClusterHash][currentTaskName].newContent">
                                            <i class="pi pi-exclamation-circle align-bottom m-2"
                                                style="font-size: 1rem;color:orange" title="有未保存的更改"></i>
                                        </div>
                                        <Button :outlined="true" class="mr-2" label="diff" @click="showDiff"></Button>
                                        <Button :outlined="true" label="上传更改" @click="uploadTask"></Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </template>
                </Card>
            </div>
        </div>
        <div v-if="currentTaskName != ''">
            <ContentDiff :show="diff" @close="diff = false"
                :oldContent="store.clusterContent[store.currentClusterHash][currentTaskName].oldContent"
                :newContent="store.clusterContent[store.currentClusterHash][currentTaskName].newContent"></ContentDiff>
        </div>
    </div>
    <textarea id="testTextArea" ref="testTextArea" rows="1"
        class="absolute invisible h-auto whitespace-pre-wrap resize-none"></textarea>
</template>

<script lang="ts" setup>
import api from "@/api/api";
import { useStore } from "@/stores/store";
import * as _ from "lodash";
import { useToast } from "vue-toastification";
import ContentDiff from "./ContentDiff.vue";
import { VueDraggable } from 'vue-draggable-plus';

const store = useStore()
const toast = useToast()
const currentTaskName = ref("")
const lineString = ref<string>('')
const textAreaValue = ref("")
const textArea = ref<any>(null)
const testTextArea = ref<any>(null)
const uploadFile = ref<any>(null)

const diff = ref(false)

const op = ref()

const showPopover = (event: Event) => {
    op.value.toggle(event);
}

const renameTask = (e: Event, oldName: string) => {
    const tempTaskCluster: TaskCluster = JSON.parse(JSON.stringify(store.currentCluster))
    let newName = (e.target as HTMLDivElement).textContent == null ? "" : (e.target as HTMLDivElement).textContent!
    if ((oldName === newName)) {
        return
    }
    if ((tempTaskCluster.tasks.indexOf(newName) !== -1) || newName === "") {
        toast.error('新名称重复或为空');
        (e.target as HTMLDivElement).innerText = oldName
        return
        // TODO
    }
    store.setTaskLoading(tempTaskCluster.hash, true)
    tempTaskCluster.tasks = [oldName]
    const params: IParams = {
        ApiType: "RenameTask",
        NewTaskCluster: tempTaskCluster,
        Content: newName
    }
    api.ChangeTask(params).then(() => {
        for (let i of store.clusterQueue[tempTaskCluster.type]) {
            if (i.hash == tempTaskCluster.hash) {
                i.tasks[i.tasks.indexOf(oldName)] = newName

                store.clusterContent[i.hash][newName] = store.clusterContent[i.hash][oldName]
                if (currentTaskName.value == oldName) {
                    currentTaskName.value = newName
                }
                delete store.clusterContent[i.hash][oldName]
                i.isTaskLoading = false
                break
            }
        }
    }).catch((err: any) => {
        store.setTaskLoading(tempTaskCluster.hash, false)
        // TODO
    })
}

const deleteTask = (task: string) => {
    const tempTaskCluster: TaskCluster = JSON.parse(JSON.stringify(store.currentCluster))
    store.setTaskLoading(tempTaskCluster.hash, true)
    const params: IParams = {
        ApiType: "DeleteTask",
        NewTaskCluster: tempTaskCluster,
        Content: task
    }
    api.ChangeTask(params).then(() => {
        for (let i of store.clusterQueue[tempTaskCluster.type]) {
            if (i.hash == tempTaskCluster.hash) {
                for (let ele of i.tasks) {
                    if (ele == task) {
                        i.tasks.splice(i.tasks.indexOf(ele), 1)
                        delete store.clusterContent[i.hash]?.[ele]
                        if (currentTaskName.value == task) {
                            currentTaskName.value = ""
                        }
                        break
                    }
                }
                i.isTaskLoading = false
                break
            }
        }
    }).catch((err: any) => {
        store.setTaskLoading(tempTaskCluster.hash, false)
        // TODO
    })
}

const newTaskAdd = (tasks: string[]) => {
    const tempTaskCluster: TaskCluster = JSON.parse(JSON.stringify(store.currentCluster))
    tempTaskCluster.tasks = tasks
    store.setTaskLoading(tempTaskCluster.hash, true)
    const params: IParams = {
        ApiType: "AddTask",
        NewTaskCluster: tempTaskCluster,
        Content: ""
    }
    op.value.hide()
    api.ChangeTask(params).then((res: any) => {
        for (let i of store.clusterQueue[tempTaskCluster.type]) {
            if (i.hash == tempTaskCluster.hash) {
                i.tasks = res.data.taskCluster.tasks
                i.isTaskLoading = false
                break
            }
        }
    }).catch((err: any) => {
        store.setTaskLoading(tempTaskCluster.hash, false)
        // TODO
    })
}

const newTaskAddCancel = () => {
    op.value.hide()
}

const onUpdateTasks = ()=>{
    const params: IParams = {
        ApiType: "ModifyCluster",
        NewTaskCluster: store.currentCluster,
        Content: ""
    }
    api.ChangeCluster(params)
}

const handleInput = (event: any) => {
    store.clusterContent[store.currentClusterHash][currentTaskName.value].newContent = textAreaValue.value
    updateLineCount()
}

const openTask = (task: string) => {
    const tempTaskCluster: TaskCluster = JSON.parse(JSON.stringify(store.currentCluster))
    if (store.clusterContent[tempTaskCluster.hash].hasOwnProperty(task)) {
        currentTaskName.value = task
        return
    }
    store.setTaskLoading(tempTaskCluster.hash, true)
    const params: IParams = {
        ApiType: "DeleteTask",
        NewTaskCluster: tempTaskCluster,
        Content: task
    }
    api.GetTaskFile(params).then((res: any) => {
        store.clusterContent[tempTaskCluster.hash][task] = { "oldContent": res.data.content, "newContent": res.data.content };
        store.currentCluster.hash == tempTaskCluster.hash ? (currentTaskName.value = task) : ""
        store.setTaskLoading(tempTaskCluster.hash, false)
    }).catch((err: any) => {
        // TODO
        store.setTaskLoading(tempTaskCluster.hash, false)
    })
}

const uploadTask = () => {
    const tempTaskCluster: TaskCluster = JSON.parse(JSON.stringify(store.currentCluster))
    const content = store.clusterContent[tempTaskCluster.hash][currentTaskName.value].newContent
    tempTaskCluster.tasks = [currentTaskName.value]
    const params: IParams = {
        ApiType: "ModifyTaskFile",
        NewTaskCluster: tempTaskCluster,
        Content: content
    }
    store.setTaskLoading(tempTaskCluster.hash, true)
    api.ChangeTaskFile(params).then((res: any) => {
        store.setTaskLoading(tempTaskCluster.hash, false)
        store.clusterContent[tempTaskCluster.hash][currentTaskName.value].oldContent = content
    }).catch(err => {
        store.setTaskLoading(tempTaskCluster.hash, false)
    })
}

const updateLineCount = () => {
    const tempTaskCluster: TaskCluster = JSON.parse(JSON.stringify(store.currentCluster))
    let tempTask = store.clusterContent[tempTaskCluster.hash][currentTaskName.value]
    const lines = tempTask.newContent.split("\n");
    const textAreaEle = textArea.value?.$el;
    const div = testTextArea.value
    div.style.fontFamily = window.getComputedStyle(textAreaEle).fontFamily;
    div.style.fontSize = window.getComputedStyle(textAreaEle).fontSize;
    div.style.width = `${textAreaEle.clientWidth - 24}px`;
    const initScrollHeight = div.scrollHeight;

    let testText = ``
    lines.forEach((line, index) => {
        div.value = line
        const scrollHeight = div.scrollHeight
        let tempCount = scrollHeight / initScrollHeight
        testText += `${(index + 1).toString()}\n`
        for (let i = 1; i < tempCount; i++) {
            testText += `\n`
        }
        if (index == 3) {
        }
    })
    lineString.value = testText
}

watch(() => store.currentClusterHash, () => {
    currentTaskName.value = ""
})

watch(currentTaskName, (newValue) => {
    if (newValue == "") {
        textAreaValue.value = ""
        lineString.value = ""
    } else {
        textAreaValue.value = store.clusterContent[store.currentClusterHash][newValue].newContent
        updateLineCount()
    }
})

const uploadInfrastFile = () => {
    uploadFile.value.click()
}

const handleFileChange = (event: any) => {
    const file = event.target.files[0]; // 获取用户选择的文件
    if (file) {
        console.log("用户选择的文件: ", file);
        const formData = new FormData();
        formData.append("file", file);
        api.UploadInfrastFile(formData).then((res: any) => {
            toast.success("上传成功")
        })
    }
    event.target.value = null;
}


const showDiff = () => {
    diff.value = true
}
</script>

<style lang='css' scoped></style>