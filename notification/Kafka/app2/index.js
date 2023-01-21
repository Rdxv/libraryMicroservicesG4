const express = require('express')
const kafka = require('kafka-node')
const { STRING } = require('sequelize')
const app = express()
const mongoose = require('mongoose')
app.use(express.json)

const dbsAreRunning = () =>{
    mongoose.connect(process.env.MONGO_URL)
    const User = new mongoose.model('user', {
        name: STRING,
        email: STRING,
        password: STRING
    })
    dbs.sync({force : true})
    const client = new kafka.KafkaClient({kafkaHost: process.env.KKAFKA_BOOTSTRAP_SERVERS})
    const consumer = new kafka.Consumer(client, [{topic: process.env.KAFKA_TOPIC}],
        {
            autoCommit: false 
    
        })
    consumer.on('message', async (message)=>{
        const user = new User(JSON.parse(message.value))
        await user.save()
    })
    consumer.on('error', (err)=> {
        console.log(err)
    })
}
setTimeout(dbsAreRunning, 10000)
    
app.listen(process.env.PORT)