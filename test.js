import yt from 'ytsr';
import fs from 'fs';





const search = await yt("run away bonjovi", { limit: 1 })
const config = JSON.stringify(search.items)
const result = JSON.parse(config)

console.log(result[0].url)


AIzaSyDtaggzyWfXN44a03NbTU71tDCJD8L91Mk