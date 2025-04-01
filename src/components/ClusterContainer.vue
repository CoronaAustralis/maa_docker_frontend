<!-- *** -->
<template>
    <div class="w-full px-4">
        <div class="grid grid-cols-1 justify-center items-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card v-for="ele in typeList">
                <template #title>{{ ele.label }}</template>
                <template #content>
                    <ScrollPanel style="height: 16rem;">
                        <div class="flex flex-col gap-1 mt-2 mb-1">
                            <Card v-for="item in store.clusterQueue[ele.type]" :key="item.hash"
                                :class="'text-sm hover:bg-gray-100 cursor-pointer ' + (item.isLoading ? 'loading' : '')"
                                @click="clickToDetail(item)">
                                <template #content>
                                    <div class="flex w-full items-center">
                                        <div class="w-7/12">
                                            <div>
                                                <div contenteditable @click.stop="() => { }"
                                                    class="cursor-text grow mb-1 rounded-md"
                                                    @blur="aliasChange($event, item)">{{
                                                        item.alias }}
                                                </div>
                                            </div>
                                            <div>
                                                <MyDatepicker :date="item.time" showTime
                                                    @getNewTime="timeChange($event, item)"></MyDatepicker>
                                            </div>
                                        </div>
                                        <div class="ml-auto flex">

                                            <div :class="(item.isEnable ? 'text-emerald-600' : 'opacity-50') + ' hover:bg-gray-200 hover:opacity-100 rounded-lg'"
                                                @click.stop="enableCluster(item)">
                                                <i v-if="store.runningTaskHash != item.hash" class="pi pi-check align-bottom p-2"
                                                    style="font-size: 1rem" title="启用?"></i>
                                                <div class="p-2" v-else title="正在运行...">
                                                    <GrPowerCycle class="w-4 h-4 animate-spin" />
                                                </div>
                                            </div>
                                            <div class="hover:bg-gray-200 hover:opacity-100 rounded-lg opacity-50">
                                                <i style="font-size: 1rem" class="pi pi-trash align-bottom p-2"
                                                    @click.stop="deleteCluster(item)"></i>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </Card>
                            <Button icon="pi pi-plus" class="w-1/3" raised aria-label="Save"
                                @click.stop="addCluster(ele.type)" />
                        </div>
                    </ScrollPanel>
                </template>
            </Card>
        </div>
    </div>
</template>

<script lang="ts" setup>
import api from '@/api/api';
import { useStore } from '@/stores/store';
import { generateHash } from '@/utils/utils';
import { useToast } from "vue-toastification";
import { GrPowerCycle } from 'vue-icons-plus/gr';

const toast = useToast()
const store = useStore()

const typeList: { label: string, type: keyof ClusterType }[] = [{ "label": "每日任务簇", "type": "day" }, { "label": "每周任务簇", "type": "week" }, { "label": "每月任务簇", "type": "month" }]

const aliasChange = (e: Event, item: TaskCluster) => {
    const tempTaskCluster: TaskCluster = JSON.parse(JSON.stringify(item))
    tempTaskCluster.alias = (e.target as HTMLDivElement).textContent == null ? "" : (e.target as HTMLDivElement).textContent!
    if ((tempTaskCluster.alias === item.alias)) {
        return
    }
    if ((tempTaskCluster.alias === "")) {
        (e.target as HTMLDivElement).textContent = item.alias
        toast.error('新名称为空')
        return
    }
    item.isLoading = true
    const params: IParams = {
        ApiType: "ModifyCluster",
        NewTaskCluster: tempTaskCluster,
        Content: ""
    }
    api.ChangeCluster(params).then(() => {
        for (let i of store.clusterQueue[item.type]) {
            if (i.hash == item.hash) {
                i.isLoading = false
                i.alias = tempTaskCluster.alias
            }
        }
    }).catch((err: any) => {
        for (let i of store.clusterQueue[item.type]) {
            if (i.hash == item.hash) {
                i.isLoading = false
            }
        }
        console.error(err)
    })
}

const timeChange = (args: { "date": Date, "callback": Function }, item: TaskCluster) => {
    item.isLoading = true
    const tempTaskCluster: TaskCluster = JSON.parse(JSON.stringify(item))
    tempTaskCluster.time = args.date
    const params: IParams = {
        ApiType: "ModifyCluster",
        NewTaskCluster: tempTaskCluster,
        Content: ""
    }
    api.ChangeCluster(params).then(() => {
        for (let i of store.clusterQueue[item.type]) {
            if (i.hash == item.hash) {
                i.isLoading = false
                i.time = tempTaskCluster.time
            }
        }
        store.sortCluster(tempTaskCluster)
        args.callback(args.date)
    }).catch((err: any) => {
        for (let i of store.clusterQueue[item.type]) {
            if (i.hash == item.hash) {
                i.isLoading = false
            }
        }
        console.error(err)
    })
}

const addCluster = (clusterType: keyof ClusterType) => {
    generateHash().then(hash => {
        const cluster: TaskCluster = {
            hash: hash,
            alias: 'New Cluster',
            type: clusterType,
            time: new Date(),
            isEnable: false,
            isLoading: true,
            isTaskLoading: false,
            tasks: []
        }
        const params: IParams = {
            ApiType: "AddCluster",
            NewTaskCluster: cluster,
            Content: ""
        }
        store.addCluster(cluster)
        api.ChangeCluster(params).then(() => {
            for (let i of store.clusterQueue[clusterType]) {
                if (i.hash == cluster.hash) {
                    i.isLoading = false
                }
            }
            store.clusterContent[cluster.hash] = {}
        }).catch((err: any) => {
            console.error(err)
            store.deleteCluster(cluster)
        })
    }
    )
}

const deleteCluster = (cluster: TaskCluster) => {
    const params: IParams = {
        ApiType: "DeleteCluster",
        NewTaskCluster: cluster,
        Content: ""
    }
    cluster.isLoading = true
    api.ChangeCluster(params).then(() => {
        store.deleteCluster(cluster)
    }).catch((err: any) => {
        console.error(err)
        cluster.isLoading = false
    })
}

const enableCluster = (item: TaskCluster) => {
    const tempTaskCluster: TaskCluster = JSON.parse(JSON.stringify(item))
    tempTaskCluster.isEnable = !item.isEnable
    const params: IParams = {
        ApiType: "ModifyCluster",
        NewTaskCluster: tempTaskCluster,
        Content: ""
    }
    item.isLoading = true
    api.ChangeCluster(params).then(() => {
        for (let i of store.clusterQueue[item.type]) {
            if (i.hash == item.hash) {
                i.isLoading = false
                i.isEnable = tempTaskCluster.isEnable
            }
        }
    }).catch((err: any) => {
        for (let i of store.clusterQueue[item.type]) {
            if (i.hash == item.hash) {
                i.isLoading = false
            }
        }
        console.error(err)
    })
}

const clickToDetail = (item: TaskCluster) => {
    store.currentClusterHash = item.hash
}
</script>

<style lang='css' scoped></style>