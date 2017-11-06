require('dotenv').config()
let Slack = require('slack')

const token = process.env.token
const channel = "C5JAAK4LU"

let bot = new Slack({token})

module.exports.run = function(printer, fatal) {
  let text
  if (fatal){
    text = "Houston! We've got a VERY SERIOUS Problem!"
    +" On: "+ printer    
  }
  else{
    text = "Houston! We've got a Problem! On: "+printer
  }

  bot.chat.postMessage({token,
    channel, 
    text, 
    as_user: false, 
    username: "Chefinho das printer", 
    icon_emoji: ":robot_face:"}, 
    (err, data) => {
      if (err){
        console.error(err)
        bot.close()
        return false
      }
      console.log("Posted at: ", data.ts)
      
    })
}
