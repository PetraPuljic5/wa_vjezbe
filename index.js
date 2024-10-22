const express = require("express");
const path = require("path");
const app = express();

const PORT = 3001;

app.get("/", (reg, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "about.html"));
})

app.get("/users", (req, res) => {
    const users = [
        { id: 1, ime: "Ana", prezime: "Anić" },
        { id: 2, ime: "Marko", prezime: "Markić" },
        { id: 3, ime: "Luka", prezime: "Lukić" }
    ];
    res.json(users);
});

app.listen(PORT, (error) => {
    if (error) {
        console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
    } else {
        console.log(`Server je pokrenut na http://localhost:${PORT}`);
    }
});