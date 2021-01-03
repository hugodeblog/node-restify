import restify from 'restify';
import * as util from 'util';

// RESTサーバーセットアップ
var server = restify.createServer({
  name: "Rest-API-Test",
  version: "0.0.1"
});

server.use(restify.plugins.authorizationParser());
server.use(check);
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser({mapParams: true}));

server.listen(4000, "localhost", function() {
    console.log(server.name + ' listening at ' + server.url);
})

process.on('uncaughtException', function(err) {
  console.error('UNCAUGHT EXCEPTION: ' + (err.stack || err));
  process.exit(1);
});

function catchProcessDeath() {
  console.log('shutdown ...');
  process.exit(0);
}
process.on('SIGTERM', catchProcessDeath);
process.on('SIGINT', catchProcessDeath);
process.on('SIGHUP', catchProcessDeath);

process.on('exit', () => { console.log('exiting...'); })

// Basic認証用のためのuser, password
var basicAuthKey = { username: 'test', password: 'password'};

function check(req, res, next) {
  console.log('check was called');
  if(req.authorization && req.authorization.basic) {
    if(req.authorization.basic.username === basicAuthKey.username
      && req.authorization.basic.password === basicAuthKey.password) {
      console.log('basic authorization OK');
      next();
    }
    else {
      res.send(401, {'message': 'Not authorized'});
      next(false);
    }
  }
  else {
    res.send(500, {'message': 'No authorization key'});
    next(false);
  }
}

// テスト用のユーザーを作成
const userList = [
  {user: 'me', password: 'me123'},
  {user: 'you', password: 'you123'}
];

// 該当ユーザーがいるかチェックする
function findUser(username, password) {
  for(let person of userList) {
    if(person.user === username && person.password === password) {
      return {'user': person.user, 'password': person.password};
    }
  }
  return;
}

// ユーザー、パスワードチェック
server.post('/password-check', (req, res, next) => {
  console.log(`req.params.username = ${req.params.username}`);
  console.log(`req.params.password = ${req.params.password}`);
  const user = findUser(req.params.username, req.params.password);
  console.log(`user=${user}`);
  if (user == undefined) {
      res.send(401, {'auth_check': 'NG', 'message': 'User/Password incorrect'});
      next(false);
  } else {
      res.send(Object.assign(user, {'auth_check': 'OK'}));
      next(false);
  }
});
