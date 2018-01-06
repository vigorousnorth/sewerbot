module.exports = {
  consumer_key:         process.env.consumer_key,
  consumer_secret:      process.env.consumer_secret ,
  access_token:         process.env.access_token,
  access_token_secret:  process.env.access_token_secret,
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  wu_key: 							process.env.wu_key  	// Weather Underground API key
} 