<script setup>
import { ref } from 'vue';

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const successMessage = ref('');

const register = async () => {
    errorMessage.value = '';
    successMessage.value = '';

    
    const usernameRegex = /^[a-zA-Z]+\.[a-zA-Z]+$/;
    if (!usernameRegex.test(username.value)) {
        errorMessage.value = 'The username must be in the form surname.firstname';
        return;
    }

    try {
        const response = await fetch(
            `https://greenvelvet.alwaysdata.net/kwick/api/signup/${username.value}/${password.value}`
        );
        const data = await response.json();

        if (data.result.status === 'done') {
            successMessage.value = 'Successful registration! Please log in.';
        } else {
            errorMessage.value = data.result.message || 'Registration error.';
        }
    } catch (error) {
        errorMessage.value = 'An error has occurred. Please check your connection.rn';
    }
};
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-green-100">
        <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
            <div class="flex flex-col items-center mb-6">
                <img src="@/assets/Open-Messenger-Logo.png" alt="Logo" class="" />
            </div>

            <form @submit.prevent="register" class="space-y-4">
                <input v-model="username" type="text" placeholder="Username (Ex: robert.landsberg)"
                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
                <input v-model="password" type="password" placeholder="Password"
                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
                <button type="submit" class="w-full px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600">
                    REGISTER
                </button>
            </form>

            <p v-if="errorMessage" class="mt-2 text-red-500 text-center">
                {{ errorMessage }}
            </p>
            <p v-if="successMessage" class="mt-2 text-green-500 text-center">
                {{ successMessage }}
            </p>

            <p class="mt-4 text-center text-gray-600">
                Have already an account?
                <router-link to="/connexion">
                    <a href="#" class="text-green-500 hover:underline">Login now!</a>
                </router-link>
            </p>
        </div>
    </div>
</template>