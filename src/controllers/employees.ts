import express from "express";
import {findAllEmployees, createEmployee, updateEmployee, deleteEmployee} from "../database/employees";



export const getAllEmployees = async(req: express.Request, res: express.Response) => {
    try {
        const contractorId = req.params.contractorId;
        const employees = await findAllEmployees(contractorId);
        console.log('Value of employees: - ', employees);
        res.json(employees);
    } catch (e) {
        console.log(e);
        res.status(400).json(e);
    }
}


export const createNewEmployee = async (req: express.Request, res: express.Response) => {

    const {contractor, employee } = req.body;
    try {
        const result: any = await createEmployee(employee, contractor.id, contractor.email);
        if (result?.alreadyExists) {
            res.status(400).json("Employee already exists");
        } else {
            res.json(result);
        }
    } catch (e) {
        res.status(400).json(e);
    }
}

export const updateAnEmployee = async (req: express.Request, res: express.Response) => {
    const {contractorId, employee} = req.body;
    try {
        const update = await updateEmployee(employee, contractorId);
        res.json(update);
    } catch (e) {
        res.status(400).json(e);
    }
}

export const deleteAnEmployee = async (req: express.Request, res: express.Response) => {
    const { contractorId, employeeEmail } = req.body;
    try {
        const del = await deleteEmployee(employeeEmail, contractorId);
        return res.json(del);
    } catch (e) {
        res.status(400).json(e);
    }
}