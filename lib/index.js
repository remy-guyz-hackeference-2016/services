import http from 'http';
import url from 'url';
import notify from './notify';

const hostname = '127.0.0.1';

const port1 = 1738;
const port2 = 1739;

http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (req.headers.Authorization === 'dankmemes') {
    res.statusCode = 201;
    var q = url.parse(req.url, true).query;
    notify(q.number, q.toName, q.fromName, q.time);
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
      action: "talk",
      voice_name: "Gwyneth",
      text
      }
    ]
  ));
}).listen(port2, hostname, () => {
  console.log(`Server running at http://${hostname}:${port2}/`);
});
