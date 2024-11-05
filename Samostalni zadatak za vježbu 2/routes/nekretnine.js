import express from 'express';
import nekretnine from '../data/nekretnine.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json(nekretnine);
});

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const nekretnina = nekretnine.find(n => n.id === id);
    
    if (!nekretnina) {
        return res.status(404).json({ message: "Nekretnina nije pronađena." });
    }
    res.status(200).json(nekretnina);
});

router.post('/', (req, res) => {
    const { naziv, opis, cijena, lokacija, brojSoba, povrsina } = req.body;

    if (!naziv || !opis || !cijena || !lokacija || !brojSoba || !povrsina) {
        return res.status(400).json({ message: "Svi podaci moraju biti poslani." });
    }

    if (cijena < 0 || brojSoba < 0) {
        return res.status(400).json({ message: "Cijena i broj soba ne mogu biti negativni." });
    }

    const novaNekretnina = {
        id: nekretnine.length + 1,
        naziv,
        opis,
        cijena,
        lokacija,
        brojSoba,
        povrsina
    };
    
    nekretnine.push(novaNekretnina);
    res.status(201).json(novaNekretnina);
});

router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const nekretninaIndex = nekretnine.findIndex(n => n.id === id);

    if (nekretninaIndex === -1) {
        return res.status(404).json({ message: "Nekretnina nije pronađena." });
    }

    const { naziv, opis, cijena, lokacija, brojSoba, povrsina } = req.body;

    if (!naziv || !opis || !cijena || !lokacija || !brojSoba || !povrsina) {
        return res.status(400).json({ message: "Svi podaci moraju biti poslani." });
    }

    if (cijena < 0 || brojSoba < 0) {
        return res.status(400).json({ message: "Cijena i broj soba ne mogu biti negativni." });
    }

    nekretnine[nekretninaIndex] = { id, naziv, opis, cijena, lokacija, brojSoba, povrsina };
    res.status(200).json(nekretnine[nekretninaIndex]);
});

router.patch('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const nekretnina = nekretnine.find(n => n.id === id);

    if (!nekretnina) {
        return res.status(404).json({ message: "Nekretnina nije pronađena." });
    }

    const { cijena, brojSoba } = req.body;

    if (cijena < 0 || brojSoba < 0) {
        return res.status(400).json({ message: "Cijena i broj soba ne mogu biti negativni." });
    }

    Object.assign(nekretnina, req.body);
    res.status(200).json(nekretnina);
});

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const nekretninaIndex = nekretnine.findIndex(n => n.id === id);

    if (nekretninaIndex === -1) {
        return res.status(404).json({ message: "Nekretnina nije pronađena." });
    }

    nekretnine.splice(nekretninaIndex, 1);
    res.status(204).send();
});

export default router;
