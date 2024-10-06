<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">Picture</th>
          <th scope="col" class="px-6 py-3">First Name</th>
          <th scope="col" class="px-6 py-3">Last Name</th>
          <th scope="col" class="px-6 py-3">Country</th>
          <th scope="col" class="px-6 py-3">City</th>
          <th scope="col" class="px-6 py-3">Email</th>
          <th scope="col" class="px-6 py-3">Control</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="user in users"
          :key="user._id"
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <th class="px-6 py-4">
            <img class="w-10 h-10 rounded-full" :src="user.picture" alt="User image" />
          </th>
          <td class="px-6 py-4">
            <div v-if="user.isEditing">
              <input
                v-model="user.first"
                :placeholder="user.first"
                type="text"
                class="border rounded p-1"
              />
            </div>
            <div v-else>{{ user.first }}</div>
          </td>
          <td class="px-6 py-4">
            <div v-if="user.isEditing">
              <input
                v-model="user.last"
                :placeholder="user.last"
                type="text"
                class="border rounded p-1"
              />
            </div>
            <div v-else>{{ user.last }}</div>
          </td>
          <td class="px-6 py-4">
            <div v-if="user.isEditing">
              <input
                v-model="user.country"
                :placeholder="user.country"
                type="text"
                class="border rounded p-1"
              />
            </div>
            <div v-else>{{ user.country }}</div>
          </td>
          <td class="px-6 py-4">
            <div v-if="user.isEditing">
              <input
                v-model="user.city"
                :placeholder="user.city"
                type="text"
                class="border rounded p-1"
              />
            </div>
            <div v-else>{{ user.city }}</div>
          </td>
          <td class="px-6 py-4">
            <div v-if="user.isEditing">
              <input v-model="user.email" type="text" class="border rounded p-1" />
            </div>
            <div v-else>{{ user.email }}</div>
          </td>

          <td class="px-6 py-4 gap-4">
            <button
              class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              v-if="user.isEditing"
              @click="editElement(user), updateUser(user._id, user)"
            >
              Done
            </button>
            <button
              class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              v-else
              @click="editElement(user)"
            >
              Edit
            </button>
            <button
              class="font-medium text-red-600 dark:text-red-500 ml-4 hover:underline"
              @click="deleteUser(user._id)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <button
      @click="addNewUser()"
      class="flex p-4 bg-blue-500 text-white uppercase w-full justify-center hover:bg-blue-600"
    >
      Add User
    </button>
  </div>
</template>

<script>
import axios from 'axios'
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const users = ref([])
    const isEditing = ref(false)
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5500/api/users')
        users.value = response.data.map((user) => ({
          ...user
        }))
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    const addNewUser = async () => {
      try {
        const response = await axios.post('http://localhost:5500/api/addUser')
        console.log('User added:', response.data)
      } catch (error) {
        console.error('Error adding user:', error)
      }
    }

    const editElement = (user) => {
      user.isEditing = !user.isEditing
    }

    const deleteUser = async (user) => {
      try {
        const response = await axios.delete(`http://localhost:5500/api/users/` + user + ``)
        console.log(response)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    const updateUser = async (id, user) => {
      try {
        const response = await axios.put(`http://localhost:5500/api/users/` + id + ``, {
          first: user.first,
          last: user.last,
          country: user.country,
          city: user.city,
          email: user.email
        })
        console.log('User updated:', response.data)
      } catch (error) {
        console.error('Error updating user:', error)
      }
    }

    onMounted(() => {
      fetchUsers()
    })

    return {
      addNewUser,
      updateUser,
      users,
      editElement,
      deleteUser
    }
  }
}
</script>
