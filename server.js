const express=require('express');
const app= express();

const PORT= process.env.PORT || 5000;
app.get('/',(req,res)=>{
    res.send('I am Coding all the tym ')
})

app.listen(PORT,()=>console.log(`Server Started at port ${PORT}`))