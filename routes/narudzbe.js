import express from 'express';
import { pizze } from './pizze.js'; 

const router = express.Router();
let narudzbe = [];

router.post('/', (req, res) => {
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

export default router;
