import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
    state: () => ({ 
        clusterQueue:{"day":[],"month":[],"week":[],"custom":[]} as {[key in keyof ClusterType]:TaskCluster[]},
        templateCluster:{} as TaskCluster,
        currentClusterHash: "",
        currentTask: "",
     }),
    actions: {
      getCurrentCluster(){
        for(let clusterList of Object.values(this.clusterQueue)){
          for(let v of clusterList){
            if(v.hash === this.currentClusterHash){
              return v
            }
          }
      }
      return {} as TaskCluster
    },
    addCluster(newCluster:TaskCluster){
      this.clusterQueue[newCluster.type].push(newCluster)
      this.clusterQueue[newCluster.type].sort((a,b)=>a.time.getTime()-b.time.getTime())
    },
    deleteCluster(cluster:TaskCluster){
      for(let ele of Object.values(this.clusterQueue[cluster.type])){
          if(ele.hash === cluster.hash){
            this.clusterQueue[cluster.type].splice(this.clusterQueue[cluster.type].indexOf(ele),1)
        }
      }
    }
  }})