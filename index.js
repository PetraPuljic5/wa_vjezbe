import express from "express";
import path from "path";
const app = express();
import pizzeRouter from './routes/pizze.js';

app.use(express.json());
app.use('/pizze', pizzeRouter); 

const PORT = 3001;

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "about.html"));
});

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
