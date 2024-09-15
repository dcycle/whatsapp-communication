const test = require('ava');

let my = require('/mycode/whatsAppSend/index.js');

console.log("******* validateMessageObject test cases ********");

test('should return false when both sendTo and message are missing', t => {
  const invalidObject = {};
  t.false(my.validateMessageObject(invalidObject));
});


test('should return false when sendTo is present but message is missing', t => {
  const validObject = { "sendTo": '91XXXXXXXXX' };
  t.false(my.validateMessageObject(validObject));
});

test('should throw error when message is present but sendTo is missing', t => {
  const validObject = { "message": 'Hello World' };
  t.false(my.validateMessageObject(validObject));
});

test('should return false when both sendTo and message are present but any one is ""', t => {
  const validObject = {
    "sendTo": '',
    "message": 'Hello World'
  };

  t.false(my.validateMessageObject(validObject));
});

test('should return true when both sendTo and message key values are present.', t => {
  const validObject = {
    "sendTo": '91XXXXXXXXXXXX',
    "message": 'Hello World'
  };

  t.true(my.validateMessageObject(validObject));
});

test('should return true when both sendTo and message key values are present and message is empty', t => {
  const validObject = {
    "sendTo": '91XXXXXXXXXXXX',
    "message": ''
  };

  t.true(my.validateMessageObject(validObject));
});

test('should return false if we pass string', t => {
  const validObject = "";

  t.false(my.validateMessageObject(validObject));
});

test('should return true when mediaurl is empty', t => {
  const validObject = {
    "sendTo": '91XXXXXXXXXXXX',
    "message": 'Hello World',
    "mediaUrl": ""
  };

  t.true(my.validateMessageObject(validObject));
});

test('should return true when mediaUrl is valid url pattern.', t => {
  const validObject = {
    "sendTo": '91XXXXXXXXXXXX',
    "message": 'Hello World',
    "mediaUrl": "https://raw.githubusercontent.com/dianephan/flask_upload_photos/main/UPLOADS/DRAW_THE_OWL_MEME.png"
  };

  t.true(my.validateMessageObject(validObject));
});

test('should return false when mediaUrl is not of valid url pattern.', t => {
  const validObject = {
    "sendTo": '91XXXXXXXXXXXX',
    "message": 'Hello World',
    "mediaUrl": "raw.githubusercontent.com/dianephan/flask_upload_photos/main/UPLOADS/DRAW_THE_OWL_MEME.png"
  };

  t.false(my.validateMessageObject(validObject));
});

// console.log("******* parsepropertySendMessage test cases ********");

// test('should return error message when both sendTo and message are missing', async t => {
//   const invalidObject = JSON.stringify({});
//   const result = await my.parsepropertySendMessage(invalidObject);
//   t.equal(result, "May be Missing required parameters: sendTo and/or message or else if media url is set it should be valid url");
//   t.end();
// });

// test('should return error message when sendTo is missing', async t => {
//   const invalidObject = JSON.stringify({ message: 'Hello!' });
//   const result = await my.parsepropertySendMessage(invalidObject);
//   t.equal(result, "May be Missing required parameters: sendTo and/or message or else if media url is set it should be valid url");
//   t.end();
// });

// test('should return error message when message is missing', async t => {
//   const invalidObject = JSON.stringify({ sendTo: '+1234567890' });
//   const result = await my.parsepropertySendMessage(invalidObject);
//   t.equal(result, "May be Missing required parameters: sendTo and/or message or else if media url is set it should be valid url");
//   t.end();
// });

// test('should return true when sendTo and message are both present', async t => {
//   const validObject = JSON.stringify({ sendTo: '+1234567890', message: 'Hello!' });
//   my.sendWhatasppMessage = async () => true; // Mock the sendWhatasppMessage method
//   const result = await my.parsepropertySendMessage(validObject);
//   t.equal(result, true);
//   t.end();
// });

// test('should throw error when input is not an object or string', async t => {
//   await t.rejects(
//     my.parsepropertySendMessage(null),
//     new Error('Message object is not valid'),
//     'Expected error was not thrown'
//   );
//   t.end();
// });



// Confirm that Message send to number in production environment
// Confirm that Message sent successfully
// AssertionError: expected 500 to equal 200
//     at Context.<anonymous> (/app/test/testwhatsappSend.js:73:32)
//     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
//   showDiff: true,
//   actual: 500,
//   expected: 200,
//   operator: 'strictEqual'
// }

//   ✔ send whatsapp message should send to a respective sendTo number or written to file. (116ms)
// Testing /app/test/testwhatsappSend.js
// Confirm that Message send to number in production environment
// Confirm that Message sent successfully
// AssertionError: expected 500 to equal 200
//     at Context.<anonymous> (/app/test/testwhatsappSend.js:115:32)
//     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
//   showDiff: true,
//   actual: 500,
//   expected: 200,
//   operator: 'strictEqual'
// }
//   ✔ send whatsapp image message with caption should send to a respective sendTo number or written to file. (89ms)
// Testing /app/test/testwhatsappSend.js
// Confirm that Message send to number in production environment
// Confirm that Message sent successfully
// AssertionError: expected 500 to equal 200
//     at Context.<anonymous> (/app/test/testwhatsappSend.js:156:32)
//     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
//   showDiff: true,
//   actual: 500,
//   expected: 200,
//   operator: 'strictEqual'
// }
//   ✔ send whatsapp image message without caption should send to a respective sendTo number or written to file. (100ms)
// Testing /app/test/testwhatsappSend.js
// Confirm that Message send to number in production environment
// Confirm that Message sent successfully
// AssertionError: expected 500 to equal 200
//     at Context.<anonymous> (/app/test/testwhatsappSend.js:197:32)
//     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
//   showDiff: true,
//   actual: 500,
//   expected: 200,
//   operator: 'strictEqual'
// }
//   ✔ send whatsapp video message should send to a respective sendTo number or written to file. (107ms)
// Testing /app/test/testwhatsappSend.js
// Confirm that Message couldn't be send. Kindly check Error Logs. case
//   ✔ verify Message couldn't be send case.

//   19 passing (25s)

// [info] Move screenshots from /tmp to /artifacts if applicable
// [info] No screenshots to move from /tmp to /artifacts
// Our output contains 'AssertionError'
// Exiting with 2
// root@whatsapp-communication:~/whatsapp-commun