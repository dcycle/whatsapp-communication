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

test('should return error message when both sendTo and message are missing', async t => {
  const invalidObject = JSON.stringify({});
  const result = await my.parsepropertySendMessage(invalidObject);
  t.true(result === "May be Missing required parameters: sendTo and/or message or else if media url is set it should be valid url");
});

test('should return error message when sendTo is missing', async t => {
  const invalidObject = JSON.stringify({ message: 'Hello!' });
  const result = await my.parsepropertySendMessage(invalidObject);
  t.true(result === "May be Missing required parameters: sendTo and/or message or else if media url is set it should be valid url");
});

test('should return error message when message is missing', async t => {
  const invalidObject = JSON.stringify({ sendTo: '+1234567890' });
  const result = await my.parsepropertySendMessage(invalidObject);
  t.true(result === "May be Missing required parameters: sendTo and/or message or else if media url is set it should be valid url");
});

test('should throw error when input is not an object or string', async t => {
  const error = await t.throwsAsync(() => my.parsepropertySendMessage(null));
  t.is(error.message, 'Message object is not valid');
});