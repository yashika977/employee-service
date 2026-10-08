const express = require("express");

const app = express();

app.use(express.json());

// Logger Middleware
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

// Employee Data
let employees = [
    {
        id: 1,
        name: "Aman",
        department: "IT",
        salary: 40000
    },
    {
        id: 2,
        name: "Priya",
        department: "HR",
        salary: 35000
    }
];

// Authentication Middleware
function checkAuth(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            message: "Authentication required"
        });
    }

    next();
}

// Validation Middleware
function validateEmployee(req, res, next) {
    const { name, department } = req.body;

    if (!name || !department) {
        return res.status(400).json({
            message: "Name and department are required"
        });
    }

    next();
}

// GET - Get all employees
app.get("/employees", checkAuth, (req, res) => {
    let result = employees;

    // Filter by department
    if (req.query.department) {
        result = result.filter(
            employee =>
                employee.department.toLowerCase() ===
                req.query.department.toLowerCase()
        );
    }

    // Search by name
    if (req.query.name) {
        result = result.filter(
            employee =>
                employee.name.toLowerCase().includes(
                    req.query.name.toLowerCase()
                )
        );
    }

    res.status(200).json(result);
});

// GET - Get employee by ID
app.get("/employees/:id", (req, res) => {
    const id = Number(req.params.id);

    const employee = employees.find(employee => employee.id === id);

    if (!employee) {
        return res.status(404).json({
            message: "Employee not found"
        });
    }

    res.status(200).json(employee);
});

// POST - Create employee
app.post("/employees", validateEmployee, (req, res) => {
    const employee = {
        id: employees.length + 1,
        ...req.body
    };

    employees.push(employee);

    res.status(201).json({
        message: "Employee created",
        employee: employee
    });
});

// PUT - Replace/update employee
app.put("/employees/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = employees.findIndex(employee => employee.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Employee not found"
        });
    }

    employees[index] = {
        id: id,
        ...req.body
    };

    res.status(200).json(employees[index]);
});

// PATCH - Update selected fields
app.patch("/employees/:id", (req, res) => {
    const id = Number(req.params.id);

    const employee = employees.find(employee => employee.id === id);

    if (!employee) {
        return res.status(404).json({
            message: "Employee not found"
        });
    }

    Object.assign(employee, req.body);

    res.status(200).json(employee);
});

// DELETE - Delete employee
app.delete("/employees/:id", (req, res) => {
    const id = Number(req.params.id);

    const oldLength = employees.length;

    employees = employees.filter(employee => employee.id !== id);

    if (employees.length === oldLength) {
        return res.status(404).json({
            message: "Employee not found"
        });
    }

    res.status(200).json({
        message: "Employee deleted"
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        message: "Something went wrong"
    });
});

// Start Server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});