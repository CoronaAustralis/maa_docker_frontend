interface IParams {
    ApiType: string;
    NewTaskCluster: TaskCluster;
    Content: string;
}

interface TaskCluster {
    hash: string;
    isEnable: boolean;
    type: keyof ClusterType;
    alias: string;
    time: Date;
    tasks: string[];
    isLoading?:boolean;
    isChangingAlias?:boolean;
    isChangingTime?:boolean;
}

interface ClusterType{
    day:string,
    week:string,
    month:string,
    custom:string
}