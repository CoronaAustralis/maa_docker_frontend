<!-- *** -->
<template>
    <div class="w-full px-4">
        <div class="grid grid-cols-1 justify-center items-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card :pt="{
                root: {
                    style: {
                        'border-radius': 'var(--p-panel-border-radius)',
                        'border': '1px solid var(--p-panel-border-color)',
                        'box-shadow': 'none'
                    }
                }
            }" v-for="ele in typeList">
                <template #title>{{ ele.label }}</template>
                <template #content>
                    <ScrollPanel style="height: 10rem;">
                        <div class="flex flex-col gap-1 mt-2 mb-1">
                            <Card v-for="item in store.clusterQueue[ele.type]" :key="item.hash"
                                :class="'text-sm hover:bg-gray-100 cursor-pointer ' + (item.isLoading ? 'loading' : 'test')">
                                <template #content>
                                    <div class="flex w-full items-center">
                                        <div>
                                            <div>
                                                <div contenteditable class="cursor-text grow mb-1" @blur="aliasChange($event, item)">{{
                                                    item.alias }}
                                                </div>
                                            </div>
                                            <DatePicker v-model="item.time"  showTime hourFormat="24" />
                                            <!-- <div>{{ item.time }}</div> -->
                                        </div>
                                        <div class="ml-auto flex">
                                            <div
                                                :class="item.isEnable ? 'hover:bg-green-200' : 'hover:bg-gray-200' + ' hover:opacity-100 rounded-lg opacity-50'">
                                                <i class="pi pi-check text-xl align-bottom m-2"></i>
                                            </div>
                                            <div class="hover:bg-gray-200 hover:opacity-100 rounded-lg opacity-50">
                                                <i class="pi pi-trash text-xl align-bottom m-2"
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

const aliasChange = (e: Event, item: TaskCluster) => {
    item.isLoading = true
    const tempTaskCluster: TaskCluster = JSON.parse(JSON.stringify(item))
    tempTaskCluster.alias = (e.target as HTMLDivElement).innerText
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
        console.error(err)
    })
}

const typeList: { label: string, type: keyof ClusterType }[] = [{ "label": "每日任务簇", "type": "day" }, { "label": "每周任务簇", "type": "week" }, { "label": "每月任务簇", "type": "month" }, { "label": "自定义任务簇", "type": "custom" }]

const store = useStore()

const addCluster = (clusterType: keyof ClusterType) => {
    generateHash().then(hash => {
        const cluster: TaskCluster = {
            hash: hash,
            alias: 'New Cluster',
            type: clusterType,
            time: new Date(),
            isEnable: false,
            isLoading: true,
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
</script>

<style lang='css' scoped>
.loading::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    z-index: 1;
}

.loading::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2rem;
    height: 2rem;
    margin-top: -1rem;
    margin-left: -1rem;
    border: 0.25rem solid #3498db;
    border-top: 0.25rem solid #fff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    z-index: 2;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

[contenteditable] {
    outline: 1px solid transparent;
    border: 1px solid #fff;
    width: 100%;
}

[contenteditable]:focus {
    border: 1px solid var(--p-primary-color);
    border-radius: 3px;
}
</style>