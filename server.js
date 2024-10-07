import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import axios from 'axios'
import cron from 'node-cron'

const app = express()
const port = 5500
app.use(cors())
app.use(express.json())

const mongoURI = 'mongodb+srv://hamoudihoury989:Moudihoury1@cluster0.rgvp5.mongodb.net/users'

const userSchema = new mongoose.Schema({
  first: String,
  last: String,
  country: String,
  city: String,
  email: String,
  picture: String,
  age: Number
})

const User = mongoose.model('User', userSchema)

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB Atlas successfully')

    app.post('/api/adduser', async (req, res) => {
      try {
        const response = await axios.get('https://randomuser.me/api/')
        const data = response.data

        console.log(data)
        const newUser = new User({
          first: data.results[0].name.first,
          last: data.results[0].name.last,
          country: data.results[0].location.country,
          city: data.results[0].location.city,
          email: data.results[0].email,
          picture: data.results[0].picture.medium,
          age: data.results[0].dob.age
        })
        await newUser.save()
        res.status(200).json({ message: 'New user added successfully' })
      } catch (error) {
        console.error('Error fetching and adding new user:', error)
        res.status(500).json({ error: 'An error occurred while adding the user' })
      }
    })
  })

  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err)
  })

// cron.schedule('0/10 * * * * *', async () => {
cron.schedule('0 0 0/3 * * *', async () => {
  User.find({})
    .then((users) => {
      users.forEach(async (element) => {
        const id = element._id.toString()
        if (element.age > 40) {
          await User.deleteOne({ _id: id })
          console.log('user deletd with the name ' + element.first + '')
        }
      })
    })
    .catch((err) => {
      console.error('Error fetching users during cron job:', err)
    })
})
// cron.schedule('0/10 * * * * *', async () => {
cron.schedule('0 0 0/3 * * *', async () => {
  try {
    const response = await axios.get('https://randomuser.me/api/')
    const data = response.data

    console.log(data)
    const newUser = new User({
      first: data.results[0].name.first,
      last: data.results[0].name.last,
      country: data.results[0].location.country,
      city: data.results[0].location.city,
      email: data.results[0].email,
      picture: data.results[0].picture.medium,
      age: data.results[0].dob.age
    })
    await newUser.save()
    console.log('New user added')
  } catch (error) {
    console.error('Error fetching and adding new user:', error)
  }
})

// to fetch all info from db
app.get('/api/users', (req, res) => {
  User.find({})
    .then((users) => {
      res.json(users)
    })
    .catch((err) => {
      console.error('Error fetching users:', err)
      res.status(500).json({ error: 'An error occurred while fetching users' })
    })
})

//to update selected user
app.put('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id
    const updatedUser = await User.findOneAndUpdate({ _id: userId }, req.body, { new: true })
    console.log(req.body)
    res.status(200).json(updatedUser)
  } catch (err) {
    console.error('Error updating user:', err)
    res.status(500).json({ error: 'An error occurred while updating the user' })
  }
})

// to delete user from db

app.delete('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id
    await User.deleteOne({ _id: userId })
    res.status(200).json({ message: 'User deleted successfully' })
  } catch (err) {
    console.error('Error deleting user:', err)
    res.status(500).json({ error: 'An error occurred while deleting the user' })
  }
})

//start
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`)
})
