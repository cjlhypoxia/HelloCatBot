const { SlashCommandBuilder } = require('discord.js');
const {	GoogleGenerativeAI,	HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const MODEL_NAME = 'gemini-1.0-pro';
// const MODEL_NAME = 'gemini-1.5-pro-latest';

const dotenv = require('dotenv');
dotenv.config();

const path = require('path');
const fs = require('fs');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('gemini')
		.setDescription('跟Gemini聊聊天')
		.addStringOption(option =>
			option.setName('內容').setDescription('輸入問題或對話').setRequired(true)),
	async execute(interaction) {
		const prompt = interaction.options.getString('內容');
		const { user } = interaction;
		const pathfile = path.resolve('./Data/Prompt', `${user.id}_prompt.json`);
		await interaction.deferReply();
		if (fs.existsSync(pathfile)) {
			runChat();
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
				/* const generationConfig = {
					temperature: 0.9,
					topK: 1,
					topP: 1,
					maxOutputTokens: 2048,
				};**/
				const generationConfig = {
					temperature: 1,
					topK: 0,
					topP: 0.95,
					maxOutputTokens: 8192,
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
				const system_instruction = '盡量使用繁體中文回應，熱心助人的AI。';
				const chat = model.startChat({
					generationConfig,
					safetySettings,
					system_instruction,
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