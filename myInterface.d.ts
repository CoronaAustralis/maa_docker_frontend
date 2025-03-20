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
    isTaskLoading?:boolean;
}

interface ClusterType{
    day:string,
    week:string,
    month:string,
    custom:string
}

interface Profiles {
    Connection: {
        AdbPath: string;
        Device: string;
        Config: string;
    };
    StaticOptions: {
        CpuOcr: boolean;
    };
    InstanceOptions: {
        TouchMode: string;
        DeploymentWithPause: boolean;
        AdbLiteEnabled: boolean;
        KillAdbOnExit: boolean;
    };
}
