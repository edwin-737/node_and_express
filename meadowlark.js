var tours = [
    { id: 0, name: 'Hood River', price: 99.99 },
    { id: 1, name: 'Oregon Coast', price: 149.95 },
];
function getWeatherData(){
    return{
        locations:[
            {
                name: 'Portland',
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather: 'Overcast',
                temp: '54.1 F (12.3 C)',
            },
            {
                name: 'Bend',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Partly Cloudy',
                temp: '55.0 F (12.8 C)',
            },
            {
                name: 'Manzanita',
                forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather: 'Light Rain',
                temp: '55.0 F (12.8 C)',
            },
        ],
    };
}

var fortune = require('./lib/fortune.js');
var express = require('express');
// const res = require('express/lib/response');
var app = express();
var handlebars = require('express3-handlebars').create({
    defaultLayout:'main',
    helpers:{
        section: function(name, options){
            if(!this._sections)
                this._sections = {};
            this._sections[name] =  options.fn(this);
            return null;
        }
    }
});
if( app.thing == null ) console.log( 'bleat!' );
app.engine('handlebars',handlebars.engine);
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'handlebars');
app.set('port',process.env.PORT||3000);
app.use(function(req,res,next){
    res.locals.showTests = app.get('env') != 'production' &&
    req.query.test == '1';
    next();
});
app.get('/',function(req,res){
    // res.type('text/plain');
    // res.send('Meadowlark travel');
    res.render('home');
});
app.get('/headers',function(req,res){
    res.set('Content-Type','text/plain');
    var s = '';
    for(var name in req.headers)
        s+=name + ': ' + req.headers[name] +'\n';
    res.send(s);
    // res.send('1');
});

app.get('/about',function(req,res){
    // res.type('text/plain');
    // res.send('About Meadowlark Travel');
    randomFortune = fortune.getFortune();
    res.render('about',{
        fortune: randomFortune,
        pageTestScript:'/qa/tests-about.js'
    });
    // res.end();
});

app.get('/jquery-test',function(req,res){
    res.render('jquery-test');
});
app.get('/nursery-rhyme',function(req,res){
    res.render('nursery-rhyme');
});
app.get('/data/nursery-rhyme',function(req,res){
    res.json({
        animal:'squirrel',
        bodyPart: 'tail',
        adjective: 'bushy',
        noun: 'heck',
    });
});
app.get('/api/tours',function(req, res){
    res.json(tours);
});
app.get('/tours/hood-river',function(req,res){
    res.render('tours/hood-river');
});
app.get('/tours/request-group-rate',function(req,res){
    res.render('tours/request-group-rate');
});
app.put('/api/tour/:id', function(req, res){
    var p = tours.some(function(p){ return p.id == req.params.id });
    console.log(p);
    if( p ) {
        if( req.query.name ) p.name = req.query.name;
        if( req.query.price ) p.price = req.query.price;
        res.json({success: true});
    } 
    else {
        res.json({error: 'No such tour exists.'});
    }
});
app.use(function(req,res,next){
    // res.type('text/plain');
    res.status(404);
    // res.send('404 - Not Found');
    res.render('404');
});
app.use(function(err,req,res,next){
    console.error(err.stack);
    // res.type('text/plain');
    res.status(500);
    // res.send('500 - Server Error');
    res.render('500');
});
app.listen(app.get('port'),function(){
    console.log('Express started on http://localhost' + 
     app.get('port') + 'press Ctrl + C to terminate');
});