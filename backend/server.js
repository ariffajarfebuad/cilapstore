const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');
require('./database/setup.js');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Backend server CilacapStore berjalan di http://localhost:${PORT}`);
});
