

<template>
    <div class="card flex justify-center">
        <Form v-slot="$form" :resolver="resolver" :initialValues="initialValues" @submit="onFormSubmit" class="flex flex-col gap-4 w-full sm:w-56">
            <div class="flex flex-col gap-1">
                <InputText name="username" type="text" placeholder="Username" fluid />
                <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">{{ $form.username.error?.message }}</Message>
            </div>
            <div class="flex flex-col gap-1">
                <InputText name="obj.email" type="text" placeholder="Email" fluid />
                <Message v-if="$form.obj?.email?.invalid" severity="error" size="small" variant="simple">{{ $form.obj?.email.error?.message }}</Message>
            </div>
            <Button type="submit" severity="secondary" label="Submit" />
        </Form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { Form } from '@primevue/forms';
import { z } from 'zod';

const initialValues = ref({
    username: 'qqqqq',
    obj:{
        email: '12@qq.com'
    }
});

const resolver = ref(zodResolver(
    z.object({
        username: z.string().min(1, { message: 'Username is required.' }),
        obj: z.object({
            email: z.string().min(1, { message: 'Email is required.' }).email({ message: 'Invalid email address.' })
        })
    })
));

const onFormSubmit = ({ valid }) => {
    if (valid) {
        toast.add({ severity: 'success', summary: 'Form is submitted.', life: 3000 });
    }
};
</script>
        