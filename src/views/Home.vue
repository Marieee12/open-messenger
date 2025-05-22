<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-green-100">
        <div class="bg-white p-6 rounded-lg shadow-lg text-center">
            <h1 class="text-3xl font-bold text-green-600">Welcome to the chat</h1>
            <h2 class="text-2xl font-semibold text-gray-700 mt-2">Open Messenger</h2>
            <p class="text-gray-500 mt-4">Chat easily with friends and family!</p>
            <router-link to="/connexion">
                <button
                    class="mt-6 w-72 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300">
                    Go to Chat
                </button>
            </router-link>
        </div>
    </div>
</template>