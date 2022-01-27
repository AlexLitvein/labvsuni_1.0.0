// TODO: @babel/register
// require('@babel/register')({
//   presets: ['@babel/preset-react']
// })

const express = require('express');
// mongodb = require('mongodb'),
const app = express();
// validator = require('express-validator'),
const logger = require('morgan');
const errorHandler = require('errorhandler');
const compression = require('compression');
// url = 'mongodb://localhost:27017',
const uri = 'mongodb://labvsuni:lab@134.90.161.173:27617';
// ReactDOMServer = require('react-dom/server'),
// React = require('react');

const { MongoClient } = require('mongodb');
let db = null;
// const { body, validationResult } = require('express-validator');

// const exphbs = require('express-handlebars');
// app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
// app.set('view engine', 'hbs');

// const Header = require('./components/header.jsx')
// const Footer = require('./components/footer.jsx')
// const MessageBoard = require('./components/board.jsx');
// const { default: SvgChart } = require('./components/SvgChart.js');
// const { default: App } = require('./client/App.jsx');

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    db = client.db('SensDb');
  } catch (err) {
    console.error(err);
  }
  // finally {
  //   // Ensures that the client will close when you finish/error
  //   await client.close();
  // }
}
run().catch(console.dir);

// mongodb.MongoClient.connect(url, function (err, client) {
//   // mongodb.MongoClient.connect(url, (err, db) => {
//   if (err) {
//     console.error(err)
//     process.exit(1)
//   }

//   let db = client.db('SensDb');

app.use(compression());
app.use(logger('dev'));
app.use(errorHandler());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(validator())
app.use(express.static('public'));

// app.use((req, res, next) => {
//   req.messages = db.collection('sensData_2021');
//   return next()
// })

app.post('/weather/getSensData', async function (req, res, next) {
  const date = new Date(req.body.startData);
  date.setHours(0);
  const range = parseInt(req.body.range);
  // console.log('req data: %s %d', date, range);
  console.log(`date: ${date}, range: ${range}`);

  const collName = 'sensData_' + date.getFullYear();
  const coll = db.collection(collName);
  const cursor = await coll.find(
    { _id: { $gte: date } },
    { limit: range * 24 + 1, sort: { _id: 1 } }
  );

  // console.log(data);
  // ,
  //     function (err, cursor) {
  //       if (err) throw err;
  // const data = await cursor.toArray(function (err, itemArr) {
  //         if (err) throw err;
  //         res.json(itemArr);
  //       });

  const data = await cursor.toArray();
  // console.log(data);
  res.json(data);
});

// app.post('/messages', (req, res, next) => {
//   console.log(req.body)
// req.checkBody('message', 'Invalid message in body').notEmpty()
// req.checkBody('name', 'Invalid name in body').notEmpty()
// let newMessage = {
//   message: req.body.message,
//   name: req.body.name
// }
// let errors = req.validationErrors()
// if (errors) return next(errors)
// req.messages.insert(newMessage, (err, result) => {
//   if (err) return next(err)
//   return res.json(result.ops[0])
// })
// })

// app.get('/', (req, res, next) => {
//     res.render('index', {
//       chart: ReactDOMServer.renderToString(React.createElement(SvgChart , { options: options, axis: axis })),

//     })
// })

//   app.get('/', (req, res, next) => {
//     res.render('index', {
//       chart: ReactDOMServer.renderToString(React.createElement(App , { store: {} })),

//     })
// })

// app.get('/', (req, res, next) => {
//   // console.log(req.messages);
//   req.messages.find({ _id: { $gte: new Date('01/05/2021') } }, { limit: (1 * 24) + 1, sort: { _id: 1 } }).toArray((err, docs) => {
//     if (err) return next(err)

//     // console.log('docs',docs);

//     res.render('index', {
//       header: ReactDOMServer.renderToString(Header()),
//       footer: ReactDOMServer.renderToString(Footer()),
//       messageBoard: ReactDOMServer.renderToString(React.createElement(MessageBoard, { messages: docs })),
//       props: '<script type="text/javascript">var messages=' + JSON.stringify(docs) + '</script>'
//     })

//   })
// })

app.listen(3000);
console.log('\x1b[33m%s\x1b[0m', 'serv started');
// })
