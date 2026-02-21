// Figyelj: feltételezem, hogy az 'app.js' a 'src' mappában van, ahogy a képen látszott.
const app = require('./src/app'); 
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Szerver fut: http://localhost:${PORT}`);
});