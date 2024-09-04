const test = require('ava');

let my = require('/mycode/whatsAppSend/index.js');

test('should return false when both sendTo and message are missing', t => {
  const invalidObject = {};
  t.false(my.validateMessageObject(invalidObject));
});


test('should return false when sendTo is present but message is missing', t => {
  const validObject = { sendTo: 'recipient@example.com' };
  t.false(my.validateMessageObject(validObject));
});

test('should throw error when message is present but sendTo is missing', t => {
  const validObject = { message: 'Hello World' };
  t.false(my.validateMessageObject(validObject));
});

test('should return false when both sendTo and message are present but any one is ""', t => {
  const validObject = {
    sendTo: '',
    message: 'Hello World'
  };

  t.false(my.validateMessageObject(validObject));
});

test('should return true when both sendTo and message key values are present.', t => {
  const validObject = {
    sendTo: '91XXXXXXXXXXXX',
    message: 'Hello World'
  };

  t.true(my.validateMessageObject(validObject));
});
