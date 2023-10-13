import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import router from './routes/taskRoutes.js';
import userRouter from './routes/user.js';
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use( express.json());

app.use('/api/tasks', router);
app.use('/api/user', userRouter);

mongoose.connect('mongodb://127.0.0.1:27017/taskDB',{
  useNewUrlParser: true, // Add these options
  useUnifiedTopology: true, // Add these options
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(error => {
    console.error("Error connecting to MongoDB:", error);
  });



app.get('/', (req, res) => {
    res.send("Hello World");
});  



app.listen(8080, () => {
    console.log("Server running on port 8080");
});
