const express = require('express')
const app = express()
app.all('/', (req, res) => {
    
    res.send('Have good afternoon baby spoon!')
})
app.listen(process.env.PORT || 3000)