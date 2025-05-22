<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const token = ref(localStorage.getItem('token'))
const userId = ref(localStorage.getItem('userId'))
const users = ref([])
const search = ref('')
const messages = ref([])
const newMessage = ref('')
const loggedUsers = ref([])



onMounted(() => {
    if (!token.value) {
        router.push('/connexion')
    } else {
        fetchUsers()
        fetchMessages()
    }
})

const setCurrentUser = (user) => {
    currentUser.value = { ...user };
};

const currentUser = ref({
    fullname: "", 
    online: true,
});


const fetchUsers = async () => {
    try {
        const response = await fetch(`https://greenvelvet.alwaysdata.net/kwick/api/user/logged/${token.value}`)
        const data = await response.json()


        if (data.result.status === 'done') {
            loggedUsers.value = data.result.user
            users.value = data.result.user.map(username => ({
                username,
                fullname: formatFullName(username),
                initials: getInitials(username),
                online: true
            }))
        }
    } catch (error) {
        console.error("Error retrieving users.", error)
    }
}


const fetchMessages = async () => {
    try {
        const response = await fetch(`https://greenvelvet.alwaysdata.net/kwick/api/talk/list/${token.value}/0`)
        const data = await response.json()
        if (data.result.status === 'done') {
            messages.value = data.result.talk.map(msg => ({
                user: msg.user,
                message: msg.content
            }))
        }
    } catch (error) {
        console.error('Error retrieving messages', error)
    }
}


const filteredUsers = computed(() => {
    return users.value.filter(user =>
        user.fullname.toLowerCase().includes(search.value.toLowerCase())
    )
})


const formatFullName = (username) => {
    return username
        .split('.')
        .map(name => name.charAt(0).toUpperCase() + name.slice(1))
        .join(' ')
}


const getInitials = (username) => {
    const parts = username.split('.')
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
}


const sendMessage = async () => {
    if (!newMessage.value.trim()) return;

    if (!token.value || !userId.value) {
        console.error("Token or User ID missing!");
        return;
    }


    const encodedMessage = encodeURIComponent(newMessage.value);

    try {
        const response = await fetch(
            `https://greenvelvet.alwaysdata.net/kwick/api/say/${token.value}/${userId.value}/${encodedMessage}`
        );
        const data = await response.json();

        if (data.result.status === "done") {
            console.log("Message sent successfully!");

            
            await fetchMessages();

            
            newMessage.value = "";
        } else {
            console.error("API error:", data);
        }
    } catch (error) {
        console.error("Error sending message:", error);
    }

};


const handleKeyDown = (event) => {
    if (event.ctrlKey && event.key === 'Enter') {
        sendMessage()
    }
}


const logout = () => {
    localStorage.removeItem('token')
    router.push('/connexion') 
}
</script>




<template>
    <div class="chat-container">
        <!-- Sidebar -->
        <aside class="sidebar">
             <div class="profile">
                <div class="avatar">IC</div>
                <div class="user-details">
                    <span class="username">Isaih Curtis</span>
                    <span class="status online"></span>
                </div>
                <button @click="logout" class="logout-button">⏻</button>
            </div> 


            <div class="search-bar">
                <input v-model="search" placeholder="Search people..." type="text" class="search-input" />
            </div>
            <ul class="user-list">
                <li v-for="user in filteredUsers" :key="user.username" class="user-item">
                    <div class="avatar">{{ user.initials }}</div>
                    <div class="user-info">
                        <span class="fullname">{{ user.fullname }}</span>
                        <span class="status" :class="user.online ? 'online' : 'offline'"></span>
                    </div>
                </li>
            </ul>
        </aside>

        <!-- Chat -->
        <main class="chat-box">
            <header class="chat-header">Open chat</header>
            <div class="messages">
                <div v-for="(msg, index) in messages" :key="index" class="message"
                    :class="{ 'sent': msg.isSent, 'received': !msg.isSent }">
                    <div class="message-bubble">
                        <p>{{ msg.message }}</p>
                        <span class="timestamp">{{ msg.timestamp }}</span>
                    </div>
                </div>
            </div>
            <div class="input-box">
                <input v-model="newMessage" @keydown.enter="sendMessage" placeholder="Enter your message here" />
                <button @click="sendMessage" style="background-color: rgb(90 194 0);">➤</button>
            </div>
        </main>
    </div>
</template>

<style>
.chat-container {
    display: flex;
    height: 100vh;
    background: #f4f4f4;
}

.sidebar {
    width: 300px;
    background-color: white;
    padding: 20px;
    border-right: 1px solid #ddd;
}

.profile {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.avatar {
    width: 50px;
    height: 50px;
    background-color: #dfedd9;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
}

.search-input {
    width: 100%;
    padding: 8px;
    border-radius: 10px;
    border: 1px solid #ccc;
}

.user-list {
    margin-top: 10px;
}

.user-item {
    display: flex;
    align-items: center;
    padding: 10px 0;
    gap: 6px;
}

.chat-box {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    background: #cecece4d;
    padding: 20px;
}

.chat-header {
    font-size: 18px;
    font-weight: bold;
    padding-bottom: 10px;
    border-bottom: 1px solid #ddd;
}

.messages {
    flex-grow: 1;
    overflow-y: auto;
    padding: 10px;
}

.message {
    display: flex;
    margin-bottom: 10px;
}

.message-bubble {
    padding: 10px;
    border-radius: 10px;
    max-width: 60%;
}

.sent .message-bubble {
    background: #007bff;
    color: white;
    align-self: flex-end;
}

.received .message-bubble {
    background: white;
}

.input-box {
    display: flex;
    padding: 10px;
    border-top: 1px solid #ddd;
}

input {
    flex-grow: 1;
    padding: 10px;
    border-radius: 20px;
    border: 1px solid #ccc;
}

button {
    margin-left: 10px;
    padding: 10px;
    background-color: #ff0000;
    color: white;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    width: 45px;
    height: 45px;
}
</style>