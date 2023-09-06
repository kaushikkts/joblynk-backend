import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import router from "./router";
// require('dotenv').config({path: __dirname + '/.env'});

const app = express();
app.use(cors({
    credentials: true
}));

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(express.json());

app.use(compression());
app.use(cookieParser());
// app.use(bodyParser.json({limit: '25mb'}));
// app.use(express.json({limit: '25mb'}));
// app.use(express.urlencoded({limit: '25mb'}));
// app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use("/", router());

const server = http.createServer(app);

server.listen(3000, () => {
    console.log(`Server running on localhost 3000`);
})