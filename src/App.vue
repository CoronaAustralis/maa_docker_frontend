<script setup lang="ts">
import api from './api/api';
import { useStore } from './stores/store';
import MyDatepicker from './components/utils/MyDatepicker.vue';

const store = useStore()

const queue = ref({} as { [key in keyof ClusterType]: TaskCluster[] })
const date = ref((new Date("2024-12-16")) as Date);

// api.GetClusters("").then((res:any) => {
//     for(let i of Object.values(res.data as {[key in keyof ClusterType]:TaskCluster[]})){
//         for(let j of i){
//             j.time = new Date(j.time)
//             j.isLoading = false
//             j.isChangingAlias = false
//             j.isChangingTime = false
//         }
//     }
//     store.clusterQueue = res.data
// })

// api.GetTemplateCluster("").then((res:any) => {
//     store.templateCluster = res.data
//     store.currentClusterHash = "template"
// })
</script>

<template>
    <div class="text-center">
    <MyDatepicker :date="date" showTime></MyDatepicker>
    </div>
    <!-- <Header></Header>
    <ClusterContainer></ClusterContainer> 
    <TasksList/> -->

    <!-- <DatePicker v-model="date" timeOnly :showSeconds="true"></DatePicker> -->
</template>

<style scoped></style>
