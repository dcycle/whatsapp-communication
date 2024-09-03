const test = require('ava');

let my = require('/mycode/whatsAppSend/index.js');

test('should throw error when both sendTo and message are missing', t => {
  const invalidObject = {};

  t.throws(() => {
    my.validateMessageObject(invalidObject);
  }, "", 'should throw an error for missing sendTo and message');

  t.end();
});

test('should throw error when sendTo is present but message is missing', t => {
  const validObject = { sendTo: 'recipient@example.com' };

  t.throws(() => {
    my.validateMessageObject(validObject);
  }, "", 'should throw an error when sendTo is present and message is missing');

  t.end();
});

test('should throw error when message is present but sendTo is missing', t => {
  const validObject = { message: 'Hello World' };

  t.throws(() => {
    my.validateMessageObject(validObject);
  }, "", 'should  throw an error when message is present and sendTo is missing');

  t.end();
});

test('should not throw error when both sendTo and message are present', t => {
  const validObject = {
    sendTo: '',
    message: 'Hello World'
  };
  const response = my.validateMessageObject(validObject);
  t.true(response === "" , 'should not throw an error when both sendTo and message are present');

  t.end();
});
