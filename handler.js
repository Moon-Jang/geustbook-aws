'use strict';

module.exports.write = async event => {
  const input = JSON.parse(event.body);
  return {
    statusCode: 200,
    body: input.contents,
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
