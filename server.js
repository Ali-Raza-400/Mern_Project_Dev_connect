const express=require('express');
const app= express();
//calling the connection component
const connectdb =require('./config/db')

//Connect Database
connectdb();
app.get('/',(req,res)=>{
    res.send('I am Coding all the tym ')
})
//init middleware
app.use(express.json({extended:false}));

//defining the Routes
app.use('/api/users',require('./routes/api/users'))
app.use('/api/auth',require('./routes/api/auth'))
app.use('/api/profile',require('./routes/api/profile'))
app.use('/api/posts',require('./routes/api/posts'))


const PORT= process.env.PORT || 5000;

app.listen(PORT,()=>console.log(`Server Started at port ${PORT}`))