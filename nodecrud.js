const mysql = require('mysql');
const express = require('express');
var cors = require('cors');
var app = express();
const bodyparser = require('body-parser');
app.use(cors())

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: false
}));

app.options('*', cors())
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud',
    multipleStatements: true
});
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", 'http://localhost:4200');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});


app.listen(3000, () => console.log('Express server is runnig at port no : 3000'));


//Get all employees
app.get('/user', (req, res) => {
    
    mysqlConnection.query('SELECT * FROM user', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Get an employees
app.get('/user/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Delete an employees
app.delete('/remove/:id',cors(), (req, res,next) => {
    mysqlConnection.query('DELETE FROM user WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    })
});

//Insert an employees
app.post('/user/add', (req, res) => {
    
    let user = req.body;
    console.log(" hello");
    console.log(req.body);

  
    var query=mysqlConnection.query("INSERT INTO user(name, email,age,location) VALUES (?,?,?,?)", [user.name,user.email, user.age, user.location], (err, rows, fields) => {
        if (!err)
            {console.log(rows);
                res.send('Inserted employee');
            }
        else
            console.log(err);
    })
}); 

//Update an employees
app.put('/user/:id', cors(), (req, res,next) => {
    
    let user = req.body;
    console.log(" hello name");
    //console.log(req.body.name);
    var sql ='UPDATE user SET  name= ?,email = ?,age= ?,location  = ? WHERE id = ?' ;
    var query= mysqlConnection.query(sql, [user.name,user.email, user.age, user.location,req.params.id],(err, rows, fields) => {
        if (!err)
        {
        console.log("server update");
            res.send('Updated successfully');
        }
        else
            console.log(err);

    })
});