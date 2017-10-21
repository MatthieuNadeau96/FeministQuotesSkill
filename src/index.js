'use strict'
const Alexa = require('alexa-sdk');
const APP_ID = "#";

const SKILL_NAME = "Feminist Quotes";
const GET_QUOTE = "Hello, here is your quote: ";
const HELP_MESSAGE = "";
const HELP_REPROMPT = "";
const STOP_MESSAGE = "Goodbye!";

// NEED 365 QUOTES FROM POWERFUL WOMAN

const data = [
  "hi"
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
