const { SlashCommandBuilder } = require('discord.js');
const {	GoogleGenerativeAI,	HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const MODEL_NAME = 'gemini-1.0-pro';
const dotenv = require('dotenv');
dotenv.config();

const path = require('path');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('google')
		.setDescription('google ai')
		.addStringOption(option =>
			option.setName('chat').setDescription('chat').setRequired(true)),
	async execute(interaction) {
		const prompt = interaction.options.getString('chat');
		const { user } = interaction;
		const pathfile = path.resolve('./Data/Prompt', `${user.id}_prompt.json`);
		await interaction.deferReply();
		if (fs.existsSync(pathfile)) {
			runChat();
			console.log(true);
		}
		else {
			const data = { 'message' : [] };
			fs.writeFileSync(path.resolve('./Data/Prompt', `${user.id}_prompt.json`), JSON.stringify(data));
			runChat();
		}
		async function runChat() {
			try {
				const genAI = new GoogleGenerativeAI(process.env.GoogleAIApi);
				const model = genAI.getGenerativeModel({ model: MODEL_NAME });
				const prompt_json = require(`../../Data/Prompt/${user.id}_prompt.json`);
				const generationConfig = {
					temperature: 0.9,
					topK: 1,
					topP: 1,
					maxOutputTokens: 2048,
				};

				const safetySettings = [
					{
						category: HarmCategory.HARM_CATEGORY_HARASSMENT,
						threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
					},
					{
						category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
						threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
					},
					{
						category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
						threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
					},
					{
						category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
						threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
					},
				];
				const chat = model.startChat({
					generationConfig,
					safetySettings,
					history: prompt_json.message,
				/** {
						role: 'user',
						parts: [{ text: '你好' }],
					},
					{
						role: 'model',
						parts: [{ text: '你好!' }],
					},**/
				});

				const result = await chat.sendMessage(prompt);
				const response = result.response.text().toString();
				prompt_json.message.push({ role: 'user', parts: [{ text: prompt }] });
				prompt_json.message.push({ role: 'model', parts: [{ text: response }] });
				const new_prompt_json = JSON.stringify(prompt_json);
				fs.writeFileSync(`./Data/Prompt/${user.id}_prompt.json`, new_prompt_json);
				return interaction.editReply(response);
			}
			catch (error) {
				console.error(error);
				return interaction.editReply(`發生錯誤，請稍後在試 \n ${error}`);
			}
		}

		// runChat();
	},
};