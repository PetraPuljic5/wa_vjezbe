import express from 'express';
import ponude from '../data/ponude.js';
import nekretnine from '../data/nekretnine.js'; 

const router = express.Router();

router.post('/', (req, res) => {
    const { idNekretnine, ime, prezime, ponuđenaCijena, brojTelefona } = req.body;

    if (!idNekretnine || !ime || !prezime || !ponuđenaCijena || !brojTelefona) {
        return res.status(400).json({ message: "Svi podaci moraju biti poslani." });
    }

    if (ponuđenaCijena < 0) {
        return res.status(400).json({ message: "Ponuđena cijena ne može biti negativna." });
    }

    const nekretnina = nekretnine.find(n => n.id === idNekretnine);
    
    if (!nekretnina) {
        return res.status(404).json({ message: "Nekretnina s navedenim ID-em ne postoji." });
    }

    const novaPonuda = {
        id: ponude.length + 1,
        idNekretnine,
        ime,
        prezime,
        ponuđenaCijena,
        brojTelefona
    };

    ponude.push(novaPonuda);
    res.status(201).json(novaPonuda);
});

export default router;
