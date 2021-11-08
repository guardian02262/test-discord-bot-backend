const passport = require("passport");
var DiscordStrategy = require("passport-discord");
const config = require("../../config");
const DiscordUser = require('../../Models/User')
passport.serializeUser( (user, done) => {
    return done(null, user.discordId)
})
passport.deserializeUser(async (discordId, done) => {
    try {
        const user = await DiscordUser.findOne({discordId})
        return user ? done(null, user) : done(null,null)
    } catch(err) {
        console.log(err)
        return done(err, null)
    }
})
passport.use(
  new DiscordStrategy({
    clientID: config.clientId,
    clientSecret: config.clientSecret,
    callbackURL: config.callbackurl,
    scope: ['identify', 'guilds']
  }, async (accesToken, refreshToken, profile, done) => {
    const { id, username, discriminator, avatar, guilds } = profile;
    try {
        const findUser = await DiscordUser.findOneAndUpdate({discordId: id}, {
            discordTag:`${username}#${discriminator}`,
            avatar,
            guilds
        }, {new: true})
        if (findUser) {
            return done(null, findUser)
        } else {
            const NewUser = new DiscordUser({discordId: id, discordTag:`${username}#${discriminator}`, avatar, guilds})
            await NewUser.save()
            return done(null, NewUser)
        }
    } catch(err) {
        console.log(err)
        return done(err,null)
    }
  })
);