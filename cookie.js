var express = require('express')
var cookieParser = require('cookie-parser')

var app = express()
app.use(cookieParser())

app.get('/', function (req, res) {

  console.log('Cookies: ', req.cookies)
  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies)
  res.cookie('name', 'express').send('cookie set'); //Sets name = express

})

app.listen(8080)

//while sign out

app.get('/clear_cookie_foo', function(req, res){
   res.clearCookie('foo');
   res.send('cookie foo cleared');
});
