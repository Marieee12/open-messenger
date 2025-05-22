<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');
const errorMessage = ref('');

const login = async () => {
    errorMessage.value = '';

    try {
        const response = await fetch(
            `https://greenvelvet.alwaysdata.net/kwick/api/login/${username.value}/${password.value}`
        );
        const data = await response.json();

        if (data.result.status === 'done') {
            
            localStorage.setItem('userId', data.result.id);
            localStorage.setItem('token', data.result.token);

            
            router.push('/chat');
        } else {
            errorMessage.value = data.result.message || 'Login failed. Please try again.';
        }
    } catch (error) {
        errorMessage.value = 'A network error occurred. Please check your connection.';
    }
};

</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-green-100">
        <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
            <div class="flex flex-col items-center mb-6">
                <img src="@/assets/Open-Messenger-Logo.png" alt="Logo" />
            </div>

            <form @submit.prevent="login" class="space-y-4">
                <input v-model="username" type="text" placeholder="Username"
                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
                <input v-model="password" type="password" placeholder="Password"
                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
                <button type="submit" class="w-full px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600">
                    LOGIN
                </button>
            </form>

            <p v-if="errorMessage" class="mt-2 text-red-500 text-center">
                {{ errorMessage }}
            </p>

            <p class="mt-4 text-center text-gray-600">
                Don't have an account?
                <router-link to="/inscription">
                <a href="" class="text-green-500 hover:underline">Register now!</a>
                </router-link>
            </p>
        </div>
    </div>
</template>