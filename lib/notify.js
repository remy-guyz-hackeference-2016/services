import Nexmo from 'nexmo';
import fs from 'fs';
import path from 'path';
import { baseUrl, credentials, callFrom, callTo } from './constants';

const {
  apiKey,
  apiSecret,
  applicationId
} = credentials;

const privateKey = fs.readFileSync(path.join(__dirname, '../', applicationId));

var nexmo = new Nexmo({
  apiKey,
  apiSecret,
  applicationId,
  privateKey
});

const notify = (number, toName, fromName, time) => {

  const queryParams = {
    toName,
    fromName,
    time
  };

  const answerUrl = Object.entries(queryParams).reduce((prev, [key, val], idx) => {
    const symbol = idx === 0 ? '?' : '&';
    return `${prev}${symbol}${key}=${val}`;
  }, baseUrl);


  return nexmo.calls.create(
    {
      to: [{
        type: 'phone',
        number
      }],
      from: {
        type: 'phone',
        number: callFrom
      },
      answer_url: [answerUrl]
    },
    function(err, res) {
      if(err) { console.error(err); }
      else { console.log(res); }
    }
  );

};

export default notify;
