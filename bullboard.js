import express from 'express';
import Queue from 'bull';
import { createBullBoard } from 'bull-board';
import {createRequire} from 'module';
const require = createRequire(import.meta.url)
const {BullAdapter} = require('bull-board/bullAdapter');

const emailQueue = new Queue('emailQueue','redis://127.0.0.1:6379/0');
const smsQueue = new Queue('smsQueue','redis://127.0.0.1:6379/0');

const app = express();
const {router} = createBullBoard([new BullAdapter(emailQueue),new BullAdapter(smsQueue)])
const data = [1,2,3,4,5,6,7]
app.use('/queues',router);
(async()=>{
    emailQueue.add(data).then((data)=>{
        emailQueue.process((data,done)=>{
            console.log(data)
            console.log("email data processed")
            const res = {message : "All okay"}
            done(res)
        })
    })
})();


app.listen(3000,()=>{
    console.log("listenning to port 3000")
})