<!-- *** -->
<template>
    <div class="w-full px-4 mt-4 mb-4">
        <Card :pt="{
            content: {
                style: {
                    'height': '24rem',
                },
            }
        }">
            <template #title>日志</template>
            <template #content>
                <div ref="logContainer" class="h-full m-0 flex flex-col overflow-y-scroll scrollbar:!w-1.5 scrollbar:!h-1.5 scrollbar:bg-transparent scrollbar-track:!bg-slate-100 scrollbar-thumb:!rounded scrollbar-thumb:!bg-slate-300 scrollbar-track:!rounded dark:scrollbar-track:!bg-slate-500/[0.16] dark:scrollbar-thumb:!bg-slate-500/50 lg:supports-scrollbars:pr-2">
                    <p v-html="content"></p>
                </div>
            </template>
        </Card>

    </div>
</template>

<script lang="ts" setup>
import AnsiToHtml from 'ansi-to-html';

const convert = new AnsiToHtml();
const content = ref('')
const logContainer = ref<HTMLElement | null>(null)

const ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`);

ws.onmessage = function (event) {
    let data = JSON.parse(event.data) as any;
    if(data.history){
        for(let i of data.history){
            content.value += `<div>${convert.toHtml(i)}</div>`
        }
    nextTick(()=>{
        logContainer.value?.scrollTo(0, logContainer.value.scrollHeight);
    })
    }else if(data.msg){
        content.value +=  `<div>${convert.toHtml(data.msg)}</div>`;
    }else{
    }
};

ws.onclose = function () {
    console.log("连接已关闭...");
};

ws.onerror = function (err) {
    console.log("连接发生错误...");
};
</script>

<style lang='css' scoped>
</style>