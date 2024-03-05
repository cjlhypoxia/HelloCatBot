const settingSchema = require('../../Models/setting.js');
const {	GoogleGenerativeAI,	HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const MODEL_NAME = 'gemini-1.0-pro';
const dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const fs = require('fs');

module.exports = {
	name: 'messageCreate',
	async execute(message) {

		const { content, guildId, channelId, author } = message;
		// return console.log(author.bot);
		function aichat() {
			// const { content, guildId } = message;
			const pathfile = path.resolve('./Data/Prompt', `${guildId}_guild_prompt.json`);
			if (fs.existsSync(pathfile)) {
				runChat();
			}
			else {
				const data = { 'message' : [] };
				fs.writeFileSync(path.resolve('./Data/Prompt', `${guildId}_guild_prompt.json`), JSON.stringify(data));
				runChat();
			}
			async function runChat() {
				try {
					const genAI = new GoogleGenerativeAI(process.env.GoogleAIApi);
					const model = genAI.getGenerativeModel({ model: MODEL_NAME });
					const prompt_json = require(`../../Data/Prompt/${guildId}_guild_prompt.json`);
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
					});

					const result = await chat.sendMessage(content);
					const response = result.response.text().toString();
					prompt_json.message.push({ role: 'user', parts: [{ text: content }] });
					prompt_json.message.push({ role: 'model', parts: [{ text: response }] });
					const new_prompt_json = JSON.stringify(prompt_json);
					fs.writeFileSync(`./Data/Prompt/${guildId}_guild_prompt.json`, new_prompt_json);
					message.reply(response);
				}
				catch (error) {
					message.reply(`發生錯誤，請稍後在試\n${error}`);
				}
			}
		}
		if (author.bot == false) {
			await settingSchema.find({ Guild: guildId }).then(async (data) => {
				if (data.length != 0 && data[0].Aichannelid != null) {
					if (channelId == data[0].Aichannelid) {
						aichat();
					}
					else {
						return;
					}
				}
			});
		}
		else {
			return;
		}
	},

};