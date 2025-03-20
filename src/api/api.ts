import service from '@/utils/request'

interface Api {
  GetClusters(params: any): Promise<any>
  GetTemplateCluster(params: any): Promise<any>
  ChangeCluster(params: IParams): Promise<any>
  ChangeTask(params: IParams): Promise<any>
  GetTaskFile(params: IParams): Promise<any>
  ChangeTaskFile(params: IParams): Promise<any>
  GetProfiles(): Promise<any>
  UpdateProfiles(params: any): Promise<any>
}
const api: Api = {
  GetClusters(params: any) {
    return service({
      url: '/GetClusters',
      method: 'get',
      params,
    })
  },
  GetTemplateCluster(params: any) {
    return service({
      url: '/GetTemplateCluster',
      method: 'get',
      params,
    })
  },

  ChangeCluster(params: IParams) {
    return service({
      url: '/ChangeCluster',
      method: 'post',
      data: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },

  ChangeTask(params: IParams) {
    return service({
      url: '/ChangeTask',
      method: 'post',
      data: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },

  GetTaskFile(params: IParams) {
    return service({
      url: '/GetTaskFile',
      method: 'post',
      data: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },

  ChangeTaskFile(params: IParams) {
    return service({
      url: '/ChangeTaskFile',
      method: 'post',
      data: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
  GetProfiles() {
    return service({
      url: '/GetProfiles',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
  UpdateProfiles(params: IParams) {
    return service({
      url: '/UpdateProfiles',
      method: 'post',
      data: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
}

export default api
