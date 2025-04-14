<script setup lang="ts">
import api from './api/api';
import { useStore } from './stores/store';

const store = useStore()

api.GetClusters("").then((res:any) => {
    for(let i of Object.values(res.data.data as {[key in keyof ClusterType]:TaskCluster[]})){
        for(let j of i){
            j.time = new Date(j.time)
            j.isLoading = false
            j.isTaskLoading = false
            store.clusterContent[j.hash] = {}
        }
    }
    store.clusterQueue = res.data.data
})

api.GetTemplateCluster("").then((res:any) => {
    const data = res.data.data as TaskCluster
    data.isLoading = false
    data.isTaskLoading = false
    store.templateCluster = data
    store.currentClusterHash = "template"
    store.clusterContent["template"] = {}
})
</script>

<template>
    <Header></Header>
    <ClusterContainer></ClusterContainer>
    <TasksList/>
    <Log/>
    <ConfirmDialog></ConfirmDialog>
</template>

<style scoped></style>
