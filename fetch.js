const axios = require("axios")

axios.get("https://dao-lootex.vercel.app/api/circulating-supply").then((res) => console.log(res.data))
