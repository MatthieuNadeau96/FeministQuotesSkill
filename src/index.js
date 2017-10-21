'use strict'
const Alexa = require('alexa-sdk');
const APP_ID = "#";

const SKILL_NAME = "Feminist Quotes";
const GET_QUOTE = "Hello, here is your quote: ";
const HELP_MESSAGE = "";
const HELP_REPROMPT = "";
const STOP_MESSAGE = "Goodbye!";

const totalQuotes = process.env.TOTAL_QUOTE_COUNT;
// NEED 365 QUOTES FROM POWERFUL WOMAN

const data = [
  "hi",
  "hello",
  "greetings",
  "sup",
  "what is up",
  "what's hizzy",
  "hey",
  "suh' dude"
];

exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context);
  alexa.appID = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};

const handlers = {
  'LaunchRequest': function() {
    this.emit('GetNewQuoteIntent');
  },
  'GetNewQuoteIntent': function() {
    const quoteArr = data;
    const quoteIndex = Math.floor(Math.random() * quoteArr.length);
    // Add a function so that there arent redundent QUOTES
    const randomQuote = quoteArr[quoteIndex];
    const speechOutput = GET_QUOTE + randomQuote;

    this.response.cardRenderer(SKILL_NAME, randomQuote);
    this.response.speak(speechOutput);
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
  var table = "PowerfulWomenQuotes";
  var id = getRandomQuoteWithExclusions(totalQuotes, quotesHeard, obj).toString();
  var params = {
    TableName: table,
    Key:{
      "Id": id
    }
  };
  if(process.env.debugFlag){console.log("GetItem Params: ", JSON.stringify(params))};
  docClient.get(params, function(err, data) {
    if(err) {
      console.error("Unable to read item. Error JSON:", JSON.stringify(err));
    } else {
      if(process.env.debugFlag){console.log("GetItem succeeded:", JSON.stringify(data))};
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
