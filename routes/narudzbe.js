import express from 'express';
import { pizze } from './pizze.js'; 

const router = express.Router();
let narudzbe = [];

router.post('/', (req, res) => {
    const narudzba = req.body;

    if (!Array.isArray(narudzba.narudzba) || narudzba.narudzba.length === 0 || !narudzba.prezime || !narudzba.adresa || !narudzba.broj_telefona) {
        return res.status(400).json({ message: 'Niste poslali ispravne podatke za narudžbu!' });
    }

    let nepostojecePizze = [];
    let ispravneNarudzbe = [];
    let ukupnaCijena = 0;

    for (const item of narudzba.narudzba) {
        if (!item.pizza || !item.velicina || !item.kolicina) {
            return res.status(400).json({ message: 'Jedan ili više objekata nema sve potrebne podatke!' });
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
        return res.status(400).json({message: `Jedna ili više pizza koje ste naručili ne postoji: ${nepostojecePizze.join(", ")}`});
    }

    narudzbe.push({
        narudzba: ispravneNarudzbe,
        prezime: narudzba.prezime,
        adresa: narudzba.adresa,
        broj_telefona: narudzba.broj_telefona
    });

    const naziviPizza = ispravneNarudzbe.map(item => `${item.pizza} (${item.velicina})`).join(" i ");

    return res.status(201).json({
        message: `Vaša narudžba za ${naziviPizza} je uspješno zaprimljena!`,
        prezime: narudzba.prezime,
        adresa: narudzba.adresa,
        ukupna_cijena: ukupnaCijena
    });
});

router.get('/', (req, res) => {
    res.json(narudzbe);
});

router.get('/:id', (req, res) => {
    const id_narudzbe = req.params.id;

    if (isNaN(id_narudzbe)) {
        return res.status(400).json({ message: 'Proslijedili ste parametar id koji nije broj!' });
    }

    const index = Number(id_narudzbe) - 1;
    const narudzba = narudzbe[index];

    if (narudzba) {
        return res.json(narudzba);
    } else {
        return res.status(404).json({ message: 'Narudžba s traženim ID-em ne postoji.' });
    }
});

router.delete('/:id', (req, res) => {
    const id_narudzbe = req.params.id;

    if (isNaN(id_narudzbe)) {
        return res.status(400).json({ message: 'Proslijedili ste parametar id koji nije broj!' });
    }

    const index = Number(id_narudzbe) - 1;
    if (narudzbe[index]) {
        narudzbe.splice(index, 1);
        return res.json({ message: 'Narudžba uspješno obrisana.' });
    } else {
        return res.status(404).json({ message: 'Narudžba s traženim ID-em ne postoji.' });
    }
});

export default router;
