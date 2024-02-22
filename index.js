//Imports
import express from 'express';
import {configDotenv} from "dotenv";
import {createClient} from '@supabase/supabase-js';
import cors from 'cors';

//Create Express App
const app = express();
const port = 5000;

//Configuration
app.use(cors());
app.use(express.json());
configDotenv();
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

//Supabase Client
const supabase = createClient(process.env.SUPA_URL, process.env.SUPA_KEY);

//Request Handlers

//Default URL
app.get("/", (req, res) => {
    res.send(`<h1>FB HelpDesk Server</h1>`);
});

//Sign-up
app.post("/sign-up", async (req, res) => {
    let {name, email, password} = req.body;

    const {data} = await supabase
        .from('hd_users')
        .select()
        .eq("email", email);
    if (data.length !== 0) {
        console.log(data);
        res.send("exists");
    } else {
        const {error} = await supabase
            .from('hd_users')
            .insert({name: name, email: email, password: password});
        if (error) {
            console.log(error);
            res.send("fail");
        } else res.send("success");
    }
});

//Server Listener
app.listen(port, () => {
    console.log("The server is listening on http://localhost:" + port);
});

