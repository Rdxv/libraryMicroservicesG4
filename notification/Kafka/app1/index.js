const express = require('express')
const app = express()
app.use(express.json())
app.post('/',(req,res)=>{

})
app.listen(process.env.PORT)