import express from 'express';
import nekretnineRouter from './routes/nekretnine.js'; 
import ponudeRouter from './routes/ponude.js'; 

const app = express();
const PORT = 3002;

app.use(express.json());

app.use('/nekretnine', nekretnineRouter);
app.use('/ponude', ponudeRouter);

app.listen(PORT, () => {
    console.log(`Poslužitelj je pokrenut na http://localhost:${PORT}`);
});
