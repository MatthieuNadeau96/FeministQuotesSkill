'use strict'
const Alexa = require('alexa-sdk');
const APP_ID = "amzn1.ask.skill.0a3cbd3b-3874-4cd2-aa08-68eeec0ff265";
const AWS = require('aws-sdk');

AWS.config.update({
  region: "us-east-1"
});

const docClient = new AWS.DynamoDB.DocumentClient();
const totalQuotes = process.env.TOTAL_QUOTE_COUNT;

const SKILL_NAME = "Words by Powerful Women";
const GET_QUOTE = "Hello, here is your quote: <break time='1s'/>";
const HELP_MESSAGE = "Help Message";
const HELP_REPROMPT = "Help Reprompt";
const STOP_MESSAGE = "Goodbye!";
const SAID_BY_INTRO = [
  "This was said by, ",
  "This quote, was said by, ",
  "<break time='1s'/> ",
  "The author of this quote, is "
]

var speechOutput;
var quotesHeard = [];
var author;


exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context);
  alexa.appID = "amzn1.ask.skill.0a3cbd3b-3874-4cd2-aa08-68eeec0ff265";
  alexa.dynamoDBTableName = 'PowerfulWomen';
  alexa.registerHandlers(handlers);
  alexa.execute();
};


const handlers = {

  'LaunchRequest': function() {
    this.emit('GetNewQuoteIntent');
  },

  'GetNewQuoteIntent': function() {

    if(this.attributes['quotesHeard'] !== undefined) {
      if(process.env.debugFlag){console.log('this.attributes["quotesHeard"] = ' + this.attributes["quotesHeard"])};
        quotesHeard = this.attributes["quotesHeard"];
      if (quotesHeard === undefined) {
        quotesHeard = [];
      }
    }

    readItem(this, quotesHeard, function(obj, data) {

      console.log("inside readItem");
      quotesHeard.push(data['Id']);
      obj.attributes['quotesHeard'] = quotesHeard;

      obj.emit(":tell", data['Quote']);

      if(process.env.debugFlag){
        console.log("Quotes so far: " + quotesHeard)
        console.log("TOTAL number of QUOTES HEARD: " + quotesHeard.length)
      };

      console.log('data: ' + data["Quote"]);
      console.log('author data: ' + data["Author"]);
      speechOutput = data["Quote"];
      author = data["Author"];
    });


    // var today = new Date();
    // var currentDate = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();

    // const quoteArr = data['Quote'];
    // const quoteIndex = Math.floor(Math.random() * totalQuotes);
    // Add a function so that there arent redundent QUOTES
    // const randomQuote = quoteArr[quoteIndex];
    // const speechOutput = GET_QUOTE;

    // this.response.cardRenderer(SKILL_NAME, randomQuote);
    console.log("speechOutput: " + speechOutput);
    this.response.speak(GET_QUOTE + speechOutput + randomIntro(SAID_BY_INTRO) + author);
    this.emit(':responseReady');
  },
  'AMAZON.HelpIntent': function() {
    const speechOutput = HELP_MESSAGE;
    const reprompt = HELP_REPROMPT;

    this.response.speak(speechOutput).listen(reprompt);
    this.emit(':responseReady');
  },
  'AMAZON.CancelIntent': function() {
    this.response.speak(STOP_MESSAGE);
    this.emit(':responseReady');
  },
  'AMAZON.StopIntent': function() {
    this.response.speak(STOP_MESSAGE);
    this.emit(':responseReady');
  }
};

function readItem(obj, pastQuotes, callback) {

  var id = getRandomQuoteWithExclusions(totalQuotes, quotesHeard, obj).toString();

  var params = {
    TableName: 'PowerfulWomenQuotes',
    Key:{ "Id": id }
  };

  console.log('reading item from dynamoDB table');

  docClient.get(params, function(err, data) {
    if(err) {
      console.error("Unable to read item. Error JSON:", JSON.stringify(err));
    } else {
      console.log("GetItem succeeded:", JSON.stringify(data));
      //
      callback(obj, data['Item']);
    }
  });
}

function getRandomQuoteWithExclusions(lengthOfArray = 0, arrayOfIndexesToExclude, obj) {
	var rand = 0;
	if (arrayOfIndexesToExclude.length == lengthOfArray) {
		arrayOfIndexesToExclude = [];
		obj.quotesHeard = [];
		if(process.env.debugFlag){
      console.log('RESET QUOTESHEARD')
      console.log('QUOTESHEARD = ' + obj.quotesHeard)
    };
	}
	var min = Math.ceil(1);
  var max = Math.floor(lengthOfArray);
	while (rand == 0 || arrayOfIndexesToExclude.includes(rand)) {
		rand = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log("random number from loop: " + rand);
	}
  return rand;
}

function randomIntro(array) {
  var i = 0;
  i = Math.floor(Math.random() * array.length);
  return(array[i]);
}
