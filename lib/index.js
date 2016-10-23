import http from 'http';
import url from 'url';
import notify from './notify';

const hostname = '0.0.0.0';

const port1 = 1738;
const port2 = 1739;

http.createServer((req, res) => {
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('access-control-allow-headers', 'Authorization, content-type, accept');
  res.setHeader('access-control-max-age', '10');
  res.setHeader('Content-Type', 'application/json');
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }
  if (true) {
    res.statusCode = 201;
    var q = url.parse(req.url, true).query;
    if (!q.toName) {
      res.statusCode=401;
      res.end();
      return;
    }
    notify(q.number, q.toName, q.fromName, q.time);
    res.statusCode=200;
    res.end();
  } else {
    res.statusCode = 401;
    res.end(JSON.stringify({ error: { message: 'Auth required'} } ));
  }
}).listen(port1, hostname, () => {
  console.log(`Server running at http://${hostname}:${port1}/`);
});

http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  var q = url.parse(req.url, true).query;
  const { toName, fromName, time } = q;
  const text = `Hello ${toName || 'there'}. ${fromName || 'Someone'} is coming to use your bathroom. They're ${time || 'a few'} minutes away.`;
  res.end(JSON.stringify(
    [
      {
      action: 'talk',
      voice_name: 'Gwyneth',
      text
      }
    ]
  ));
}).listen(port2, hostname, () => {
  console.log(`Server running at http://${hostname}:${port2}/`);
});
