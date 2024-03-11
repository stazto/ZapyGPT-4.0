import inquirer from 'inquirer';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const mainQuestion = [
  {
    type: 'list',
    name: 'AI_SELECTED',
    message: 'Choose the AI you want to use:',
    choices: ['GPT', 'GEMINI'],
  },
];

const commonQuestions = [
  {
    type: 'input',
    name: 'MESSAGE_TO_SEND_WHEN_IMAGE_RECEIVED',
    message: 'Provide the message for when receiving images:',
    default:
      'I still can't process images. Please send a text:',
  },
  {
    type: 'input',
    name: 'MESSAGE_TO_SEND_WHEN_RECEIVING_AUDIO',
    message: 'Specify the message for when you receive audios:',
    default:
      'I still can't process audio. Please send a text.',
  },
  {
    type: 'input',
    name: 'MESSAGE_TO_SEND_WHEN_UNKNOWN_TYPE_RECEIVED',
    default:
      'I still can't process the message you sent. Please, send a text.',
    message:
      'Specify the message for when you receive a message of other types (document, location, etc...):',
  },
  {
    type: 'input',
    name: 'HOURS_TO_REACTIVATE_AI',
    message:
      'Enter the number of hours for the AI to start responding to a conversation again after a human intervention in the conversation:',
    default: '24',
  },
  {
    type: 'input',
    name: 'RESPOND_ONLY',
    message:
      'If you don't want the AI to respond to all contacts, type here the numbers separated by commas that it should respond to: (example: "3530831106665, 3530831106666")',
  },
  {
    type: 'input',
    name: 'DO_NOT_RESPOND',
    message:
      'If you want the AI not to respond to specific numbers, type here the numbers separated by commas that it should NOT respond to: (example: "3530831106665, 3530831106666")',
  },
  {
    type: 'input',
    name: 'SECONDS_TO_WAIT_BEFORE_GENERATING_RESPONSE',
    message: 'Enter the seconds to wait before generating a response:',
    default: '10',
  },
];

const geminiQuestion = [
  {
    type: 'input',
    name: 'GEMINI_KEY',
    message:
      'Informe a sua GEMINI_KEY (https://aistudio.google.com/app/apikey):',
    validate: (input) =>
      !!input ||
      'The GEMINI_KEY cannot be empty. Please enter a valid value.',
  },
  {
    type: 'input',
    name: 'GEMINI_PROMPT',
    message: 'Enter your prompt:',
  },
];

const gptQuestions = [
  {
    type: 'input',
    name: 'OPENAI_KEY',
    message: 'Enter your OPENAI_KEY (https://platform.openai.com/api-keys):',
    validate: (input) =>
      !!input ||
      'The OPENAI_KEY It cannot be empty. Please provide a valid value.',
  },
  {
    type: 'input',
    name: 'OPENAI_ASSISTANT',
    message:
      'Enter your OPENAI_ASSISTANT (https://platform.openai.com/assistants):',
    validate: (input) =>
      !!input ||
      'The OPENAI_ASSISTANTIt cannot be empty. Please provide a valid value.',
  },
];

const processCommonQuestions = async (envConfig) => {
  const commonAnswers = await inquirer.prompt(commonQuestions);
  Object.keys(commonAnswers).forEach((key) => {
    envConfig += `${key}="${commonAnswers[key]}"\n`;
  });
  return envConfig;
};

inquirer.prompt(mainQuestion).then(async (answers) => {
  let envConfig = `AI_SELECTED="${answers.AI_SELECTED}"\n`;

  if (answers.AI_SELECTED === 'GEMINI') {
    const geminiAnswer = await inquirer.prompt(geminiQuestion);
    envConfig += `GEMINI_KEY="${geminiAnswer.GEMINI_KEY}"\nGEMINI_PROMPT="${geminiAnswer.GEMINI_PROMPT}"\n`;
  } else {
    const gptAnswers = await inquirer.prompt(gptQuestions);
    envConfig += `OPENAI_KEY="${gptAnswers.OPENAI_KEY}"\nOPENAI_ASSISTANT="${gptAnswers.OPENAI_ASSISTANT}"\n`;
  }

  envConfig = await processCommonQuestions(envConfig);

  fs.writeFileSync('.env', envConfig, { encoding: 'utf8' });
  console.log('Configuration saved successfully! 🎉');
});
