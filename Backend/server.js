const express = require('express');
const app = express();
const connectDB = require('./config/db')


//Connect Database
connectDB();

app.get('/', (req, res) => res.send('API Running...'));
const PORT = process.env.PORT || 5000;

//Define ROutes
app.use('/api/users', require('./Routes/api/users'));
app.use('/api/auth', require('./Routes/api/auth'));
app.use('/api/profile', require('./Routes/api/profile'));
app.use('/api/post', require('./Routes/api/post'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

