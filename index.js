// Module imports
import express from "express";

// Initialising server
const app = express;
// Initialising port
const port = 3000;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});