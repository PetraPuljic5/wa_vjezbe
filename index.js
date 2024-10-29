const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());

const PORT = 3001;

app.get("/", (req, res) => {
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

const pizze = [
    { id: 1, naziv: 'Margherita', cijena: 6.5 },
    { id: 2, naziv: 'Capricciosa', cijena: 8.0 },
    { id: 3, naziv: 'Quattro formaggi', cijena: 10.0 },
    { id: 4, naziv: 'Šunka sir', cijena: 7.0 },
    { id: 5, naziv: 'Vegetariana', cijena: 9.0 }
];

app.get('/pizze', (req, res) => {
    res.json(pizze);
});

app.get('/pizze/:id', (req, res) => {
    const id_pizza = req.params.id;
    if (isNaN(id_pizza)){
        res.json({ message: 'Proslijedili ste parametar id koji nije broj!' });
        return;
    }

    const pizza = pizze.find(pizza => pizza.id == id_pizza);
    if (pizza) {
        res.json(pizza);
    } else {
        res.json({ message: 'Pizza s traženim ID-em ne postoji.' });
    }
});

let narudzbe = [];

app.post('/naruci', (req, res) => {
    const narudzba = req.body;

    if (!Array.isArray(narudzba.narudzba) || narudzba.narudzba.length === 0 || !narudzba.prezime || !narudzba.adresa || !narudzba.broj_telefona) {
        res.status(400).json({ message: 'Niste poslali ispravne podatke za narudžbu!' });
        return;
    }

    let nepostojecePizze = [];
    let ispravneNarudzbe = [];
    let ukupnaCijena = 0;

    for (const item of narudzba.narudzba) {
        if (!item.pizza || !item.velicina || !item.kolicina) {
            res.status(400).json({ message: 'Jedan ili više objekata nema sve potrebne podatke!' });
            return;
        }

        const postojiPizza = pizze.find(pizza => pizza.naziv === item.pizza);
        if (postojiPizza) {
            ispravneNarudzbe.push(item);
            ukupnaCijena += postojiPizza.cijena * item.kolicina;
        } else {
            nepostojecePizze.push(item.pizza);
        }
    }

    if (nepostojecePizze.length > 0) {
        res.status(400).json({
            message: `Jedna ili više pizza koje ste naručili ne postoji: ${nepostojecePizze.join(", ")}`
        });
        return;
    }

    narudzbe.push({
        narudzba: ispravneNarudzbe,
        prezime: narudzba.prezime,
        adresa: narudzba.adresa,
        broj_telefona: narudzba.broj_telefona
    });

    const naziviPizza = ispravneNarudzbe.map(item => `${item.pizza} (${item.velicina})`).join(" i ");
    
    res.json({
        message: `Vaša narudžba za ${naziviPizza} je uspješno zaprimljena!`,
        prezime: narudzba.prezime,
        adresa: narudzba.adresa,
        ukupna_cijena: ukupnaCijena
    });
});

app.listen(PORT, (error) => {
    if (error) {
        console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
    } else {
        console.log(`Server je pokrenut na http://localhost:${PORT}`);
    }
});
