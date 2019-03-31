const express = require('express');
const app = express();

app.use(express.static('./client'));

app.listen(9000, () => {
    console.log('Listening on 9000');
})