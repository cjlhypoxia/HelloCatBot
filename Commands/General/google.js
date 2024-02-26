const {SlashCommandBuilder} = require('discord.js');
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");

const MODEL_NAME = "gemini-1.0-pro";
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('google')
        .setDescription('google ai')
        .addStringOption(option =>
            option.setName('chat').setDescription('chat').setRequired(true)),
    async execute(interaction) {
        const prompt = interaction.options.getString('chat');
        await interaction.deferReply();
        async function runChat() {
            const genAI = new GoogleGenerativeAI(process.env.GoogleAIApi);
            const model = genAI.getGenerativeModel({ model: MODEL_NAME });
          
            const generationConfig = {
              temperature: 0.9,
              topK: 1,
              topP: 1,
              maxOutputTokens: 2048,
            };
          
            const safetySettings = [
              {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
              },
              {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
              },
              {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
              },
              {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
              },
            ];
          
            const chat = model.startChat({
              generationConfig,
              safetySettings,
              history: [
              ],
            });
          
            const result = await chat.sendMessage(prompt);
            const response = result.response.text().toString();
            return interaction.editReply(response);
          }
          
          runChat();
    },
};