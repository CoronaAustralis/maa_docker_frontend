import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
  state: () => ({
    clusterQueue: { day: [], month: [], week: [], custom: [] } as {
      [key in keyof ClusterType]: TaskCluster[]
    },
    templateCluster: {} as TaskCluster,
    clusterContent:{} as {[props:string]:{[props:string]:{"oldContent":string,"newContent":string}}},
    currentClusterHash: '',
    profiles: "",
    runningTaskHash: "",
  }),
  getters: {
    currentCluster: state => {
      if(state.currentClusterHash === "template") {
        return state.templateCluster
      }
      for (let clusterList of Object.values(state.clusterQueue)) {
        for (let v of clusterList) {
          if (v.hash === state.currentClusterHash) {
            return v
          }
        }
      }
      return {} as TaskCluster
    },
  },
  actions: {
    setTaskLoading(hash:string,loading: boolean) {
      if(hash === "template") {
        this.templateCluster.isTaskLoading = loading
        return
      }
      for (let ele of Object.values(this.clusterQueue)) {
        for (let v of ele) {
          if (v.hash === hash) {
            v.isTaskLoading = loading
            return
          }
        }
      }
    },
    sortCluster(newCluster: TaskCluster) {
      this.clusterQueue[newCluster.type].sort(
        (a, b) => a.time.getTime() - b.time.getTime(),
      )
    },
    addCluster(newCluster: TaskCluster) {
      this.clusterQueue[newCluster.type].push(newCluster)
      this.clusterContent[newCluster.hash] = {}
      this.clusterQueue[newCluster.type].sort(
        (a, b) => a.time.getTime() - b.time.getTime(),
      )
    },
    deleteCluster(cluster: TaskCluster) {
      for (let ele of Object.values(this.clusterQueue[cluster.type])) {
        if (ele.hash === cluster.hash) {
          this.clusterQueue[cluster.type].splice(
            this.clusterQueue[cluster.type].indexOf(ele),
            1,
          )
          delete this.clusterContent[cluster.hash]
          if(this.currentClusterHash === cluster.hash) {
            this.currentClusterHash = 'template'
          }
          delete this.clusterContent[cluster.hash]
          break
        }
      }
    },
  },
})
