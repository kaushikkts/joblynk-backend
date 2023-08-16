import { MongoClient, ServerApiVersion } from 'mongodb';
import {getPassword} from "../helper/get-database-password";

export const connectToDatabase = async () => {
    try {
        const p = await getPassword();
        // const url = `mongodb://0.0.0.0:27017/joblynk?retryWrites=true&w=majority`;
        const url = `mongodb+srv://joblynk-dev:${p}@cluster0.zevx1ca.mongodb.net/joblynk?retryWrites=true&w=majority`;
        let client: MongoClient = new MongoClient(url, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: false,
                deprecationErrors: true
            }
        });
        await client.connect();
        return client;
    } catch (e) {
        console.log(e);
        return e;
    }
}


