const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const appRoutes = require('./routes/index');
const messageRoutes = require('./routes/messages');
const userRoutes = require('./routes/user');

// mongodb://root:root123@ds125372.mlab.com:25372/db_angular-node
// mongodb://localhost:27017/angular-node
mongoose.connect('mongodb://localhost:27017/angular-node', function(err) {
    if (err) console.log('MongoDB Connection Error');
    else console.log('MongoDB Connected Successfully');
});

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/message', messageRoutes);
app.use('/user', userRoutes);
app.use('/', appRoutes);


const port = 3000;
app.listen(port, function() {
    console.log('app is listening on port', port);
})