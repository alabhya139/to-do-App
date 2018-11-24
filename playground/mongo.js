const mongoClient = require('mongodb').MongoClient

const dbUrl = "mongodb://localhost:27017/toDoApp";

mongoClient.connect(dbUrl,{useNewUrlParser:true},(err,client)=>{
    if(err){
        console.log("Unable to connect to database")
    }

    const db = client.db('toDoApp');

//     db.collection('toDos').insertOne({
//         text:"Something todo",
//         completed:false
//     },(err,result)=>{
//         if(err){
//             console.log("Cant inser data")
//         }
//         console.log(result.ops)
//     })

//     db.collection('Users').insertOne({
//         name:"Alabhya Pandey",
//         age:22,
//         location:"India"
//     },(err,result)=>{
//         if(err){
//             console.log("Cant inser data")
//         }
//         console.log(result.ops)
//     })

db.collection('Users').find({name:"Alabhya"}).toArray()
    .then(res=>console.log(JSON.stringify(res,undefined,2)))
    .catch(error=>console.log("Some Error Occured",error))
})