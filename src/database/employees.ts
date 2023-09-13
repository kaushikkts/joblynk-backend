import {connectToDatabase} from "./database-functions";
import {MongoClient, ObjectId} from "mongodb";
import {ServicePartnersModel} from "../models/service-partners.model";
import {EmployeeModel} from "../models/employee.model";
import {sendAppRegistrationEmail} from "./amazon.ses";

const DB_NAME = 'joblynk';
const COLLECTION = 'contractor';

export const findAllEmployees = async (contractorId: string) => {
    let client: MongoClient;
    try {
        client = await connectToDatabase();
        // find the contractor, and then pull the Service Partner array
        const contractor = await client.db(DB_NAME).collection(COLLECTION).find({_id: new ObjectId(contractorId)}).project({employees: 1}).toArray();
        console.log('Fetching the contractor object: - ', contractor);
        return contractor[0]?.employees ? contractor[0]?.employees : null;
    } catch (e) {
        console.log(`Error in getAllEmployees database/employees.ts file : - ${e}`);
        throw e;
    } finally {
        await client.close();
    }
}

export const createEmployee = async (employee: EmployeeModel, contractorId: string, contractorEmail: string) => {

    let client: MongoClient;
    try {
        client = await connectToDatabase();
        const existingEmployee = await client.db(DB_NAME).collection(COLLECTION).findOne({"employees.email": employee.email})
        if (!existingEmployee) {
            employee._id = new ObjectId().toString();
            await sendAppRegistrationEmail(employee.email, contractorEmail, "EMPLOYEE", contractorId);
            return await client.db(DB_NAME).collection(COLLECTION).updateOne({_id: new ObjectId(contractorId)}, {$addToSet: {
                    "employees": employee
            }});
        }
        return  {
            alreadyExists: 1,
            message: "Employee already exists"
        };
    } catch (e) {
        console.log(`Error in createEmployee database/employees.ts file : - ${e}`);
        if (typeof e === "object" && e.code === 11000) {
            throw {status: 11000, message: "Data with same email is already registered in the database"}
        } else {
            throw e;
        }
    } finally {
        await client.close();
    }
}

export const updateEmployee = async (employee: EmployeeModel, contractorId: string) => {
    let client: MongoClient;
    try {
        client = await connectToDatabase();
        return await client.db(DB_NAME).collection(COLLECTION).updateOne(
            {_id: new ObjectId(contractorId),  "employees.email": employee.email}, {

                $set: {
                    "employees.$.firstName": employee.firstName,
                    "employees.$.lastName": employee.lastName,
                    "employees.$.gender": employee.gender,
                    "employees.$.email": employee.email,
                    "employees.$.phone": employee.phone,
                    "employees.$.title": employee.title,
                    "employees.$.department": employee.department
                }
            });
    } catch (e) {
        console.log(`Error in updateEmployees database/employee.ts file : - ${e}`);
        throw e;
    } finally {
        await client.close();
    }
}

export const deleteEmployee = async (employeeEmail: string, contractorId: string) => {
    let client: MongoClient;
    try {
        client = await connectToDatabase();
        return await client.db(DB_NAME).collection(COLLECTION).updateOne({_id: new ObjectId(contractorId)}, {
            $pull: {
                "employees": {
                    "email" : employeeEmail,
                }
            }
        }, {
            upsert: false
        });
    } catch (e) {
        console.log(`Error in deleting employee database/employee.ts file : - ${e}`);
        throw e;
    } finally {
        await client.close();
    }
}