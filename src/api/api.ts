import service from '@/utils/request'

const api:{[props:string]:Function} = {}

api.GetClusters = (params: any) => {
  return service({
    url: '/GetClusters',
    method: 'get',
    params,
  })
}

api.GetTemplateCluster = (params: any) => {
  return service({
    url: '/GetTemplateCluster',
    method: 'get',
    params,
  })
}

api.ChangeCluster = (params: IParams) => {
  return service({
    url: '/ChangeCluster',
    method: 'post',
    data:JSON.stringify(params),
    headers:{
      'Content-Type': 'application/json'
    }
  },)
}

api.ChangeTask = (params: IParams) => {
  return service({
    url: '/ChangeTask',
    method: 'post',
    data:JSON.stringify(params),
    headers:{
      'Content-Type': 'application/json'
    }
  })
}

export default api