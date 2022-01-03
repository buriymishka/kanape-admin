const express = require('express')
const path = require('path');
const bodyParser = require('body-parser')
const serveStatic = require('serve-static');
const cookieParser = require('cookie-parser');
const routerUser = require('./routes/user.route')
const routerToken = require('./routes/token.routes')
const app = express()
const port = process.env.PORT || 3000
const hostname = process.env.HOST || 'localhost'
const db = require('./db')
const { IS_PROD } = require('./globalVars')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', IS_PROD ? 'http://kanapeadmin-env.eba-jbuz8m4h.us-east-2.elasticbeanstalk.com' : 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,access_token');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(routerUser)
app.use(routerToken)

app.use('/css', express.static(path.resolve(__dirname, '../dist/css')));
app.use('/js', express.static(path.resolve(__dirname, '../dist/js')));
app.use('/img', express.static(path.resolve(__dirname, '../dist/img')));
app.use('/favicon.ico', express.static(path.resolve(__dirname, '../dist/favicon.ico')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, hostname, () => {
  console.log('server started: ', hostname + ':' + port)
})

if (IS_PROD) {
  db.sync({ alter: true })
}
