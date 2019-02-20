const Alexa = require('ask-sdk');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    
    const speakOutput = 'Welcome to Virtual Receptionist';
    const rtext='Welcome to virtual receptionist';

    
    return handlerInput.responseBuilder
      .speak(speakOutput) 
      .reprompt(rtext)
      .getResponse();
  },
};

const GreetingHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'Greeting';
  },
  handle(handlerInput) {
   
    const speakOutput = 'Hello, May i know your name';
    const repromptText='Please may i know your name ?'

   
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(repromptText)
      .getResponse();
  },
};
const IntroduceHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'Introduce';
  },
  handle(handlerInput) {
    
    const speakOutput = 'Hello '+handlerInput.requestEnvelope.request.intent.slots.name.value+' Who do you want to meet';
    const rprompt='Hello'+handlerInput.requestEnvelope.request.intent.slots.name.value+'Please may i know who do you want to meet';
    var cp=handlerInput.requestEnvelope.request.intent.slots.name.value;
    /*const attributesManager = handlerInput.attributesManager;
    const responseBuilder = handlerInput.responseBuilder;

    const attributes = await attributesManager.getPersistentAttributes() || {};

    if (Object.keys(attributes).length === 0) {
      attributes.nameValue = nameValue;
      attributesManager.setPersistentAttributes(attributes);
      await attributesManager.savePersistentAttributes();
    } else {
      speechText = `I remember you... you told me your name was ${attributes.nameValue.toString()}.`;
    }*/
    Alexa.config.update({
      region:"us-east",
      endpoint:"lambda:us-east-1:043429404192:function:aws-serverless-repository-alexaskillskitnodejstriv-1WA7BRJM5IE6H"
    });
    var dc=new AWS.DynamoDB.DocumentClient();
    console.log("Qurying for matching contact person");
    var params = {
      TableName : "Employee",
      KeyConditionExpression: "#emp_name = :name",
      
      ExpressionAttributeValues: {
          ":name":{"S":cp}
      }
    };
   dc.query(params,function(err,data)){
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
  } else {
      console.log("Query succeeded.");
      data.Items.forEach(function(item) {
          console.log(" -", item.name + ": " + item.emp_timing+" -"+item.emp_status);
          if(item.emp_status===true)
            console.log("He is available");
          else
            console.log("He is not available");
      });
  }
});

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(rprompt)
      .getResponse();
  },
};
const contactPersonHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'contactPerson';
  },
  handle(handlerInput) {
  
    const speakOutput = 'Please let me check if  '+handlerInput.requestEnvelope.request.intent.slots.cname.value+' is available';
    const contact=handlerInput.requestEnvelope.request.intent.slots.cname.value;
    
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  },
};
const HelpHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speakOutput = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  },
};

const CancelAndStopHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speakOutput = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  },
};
  
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(error.trace);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    GreetingHandler,
    IntroduceHandler,
    contactPersonHandler,
    HelpHandler,
    CancelAndStopHandler,
    SessionEndedRequestHandler,
  )
  .addErrorHandlers(ErrorHandler)
  //.withTableName('Employee')
  //.withAutoCreateTable(false)
  .lambda();
