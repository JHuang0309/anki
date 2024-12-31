const express = require('express')
const app = express()

app.get("/api", (req, res) => {
    res.json({"users": ["jason", "jayden", "goran", "vahin"]})
})

const PORT = 5005
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})