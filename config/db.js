const mongoose=require('mongoose')
const config= require('config');

const db=config.get('mongoURL');

//connection to database;

const connectdb=async()=>{
try{
       await mongoose.connect(db)
       console.log('connected to database')

}catch(error){
console.log(error.message);
//if error then to stop the process
process.exit(1)
}
}

module.exports = connectdb;