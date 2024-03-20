const axios = require('axios');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const apiKey = process.env.BitoKey;
const apiSecret = process.env.BitoSec;
const baseUrl = 'https://api.bitopro.com/v3';
const email = process.env.Mail;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('crypto')
		.setDescription('看看毛毛有多少加密貨幣'),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		function sendRequest(method, url, headers, data, timeout) {
			return axios({
				method: method,
				url: url,
				headers: headers,
				data: data,
				timeout: timeout,
			});
		}

		function main() {
			const nonce = Date.now();
			const params = { identity: email, nonce: nonce };
			const payload = Buffer.from(JSON.stringify(params)).toString('base64');
			const signature = crypto.createHmac('sha384', apiSecret)
				.update(payload)
				.digest('hex');
			const headers = {
				'X-BITOPRO-APIKEY': apiKey,
				'X-BITOPRO-PAYLOAD': payload,
				'X-BITOPRO-SIGNATURE': signature,
			};
			const endpoint = '/accounts/balance';
			const completeUrl = baseUrl + endpoint;
			const embed = new EmbedBuilder();
			sendRequest('GET', completeUrl, headers)
				.then(response => {
					const responseData = response.data.data;
					const filteredData = responseData.filter(item => parseFloat(item.amount) !== 0);
					// console.log('Non-zero balance:', filteredData);
					embed.setColor('Random')
						.setTitle('毛毛的加密貨幣')
						.setDescription(`${filteredData.map((cry, id) => (`\n${id + 1}. ${cry.currency} - **${cry.amount}**`))}`)
						.setTimestamp();
					interaction.editReply({ embeds : [embed] });
				})
				.catch(error => {
					// console.error('Request failed:', error.message);
					embed.setColor('Random')
						.setTitle('毛毛的加密貨幣')
						.setDescription(`取得資料發生錯誤。\n${error.message}`)
						.setTimestamp();
					interaction.editReply({ embeds : [embed] });
				});
		}
		main();
	},
};
