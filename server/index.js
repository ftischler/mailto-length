const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');

const port = process.env.PORT || 3000;
const distPath = path.join(__dirname, '..', 'dist', 'mailto-length');

const app = express();

app.use(helmet());
app.use(compression());

app.use('/', express.static(distPath));

app.listen(port, () => console.log(`App is listening on port ${port}`));

