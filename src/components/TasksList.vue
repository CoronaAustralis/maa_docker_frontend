<!-- *** -->
<template>
    <div class="px-4 flex flex-rows mt-4 gap-4 w-full">
        <div class="w-1/6">
            <Panel
                :header="store.currentClusterHash == '' ? 'No data' : store.currentClusterHash == 'template' ? 'Template cluster' : store.getCurrentCluster()?.alias">
                <Card>
                    <template #content>
                        <div v-if="store.currentClusterHash == ''">
                        </div>
                        <div v-else-if="store.currentClusterHash == 'template'">
                            <Card v-for="i in store.templateCluster.tasks" class="mb-2 hover:bg-gray-100 cursor-pointer">
                                <template #content>
                                    <div class="flex w-full items-center">
                                        <div>
                                        {{ i }}
                                        </div>
                                        <div class="ml-auto flex">
                                            <div class="hover:bg-gray-200 hover:opacity-100 cursor-pointer rounded-lg opacity-50">
                                                <i class="pi pi-pen-to-square text-sm align-bottom m-2"></i>
                                            </div>
                                            <div class="hover:bg-gray-200 hover:opacity-100 cursor-pointer rounded-lg opacity-50" >
                                            <i class="pi pi-trash text-sm align-bottom m-2"></i>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </Card>
                        </div>
                        <div v-else="">
                            <Card v-for="i in store.getCurrentCluster()" class="mb-2 hover:bg-gray-100">
                                <template #content>
                                    <p class="m-0">
                                        {{ i }}
                                    </p>
                                </template>
                            </Card>
                        </div>
                    </template>
                </Card>
            </Panel>
        </div>
        <div class="grow">
            <Card :pt="{
                root: {
                    style: {
                        'border-radius': 'var(--p-panel-border-radius)',
                        'border': '1px solid var(--p-panel-border-color)',
                        'box-shadow': 'none'
                    }
                }
            }">
                <template #content>
                    <Textarea :value="textAreaValue" @input="handleInput" ref="textArea" autoResize rows="5"
                        class="w-full" />
                </template>
            </Card>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useStore } from "@/stores/store";
import * as _ from "lodash"


const textAreaValue = ref("")

const store = useStore()

const textArea = useTemplateRef("textArea")

const handleInput = _.debounce(function (event: any) {
    textAreaValue.value = event.target.value
}, 300)

</script>

<style lang='css' scoped></style>