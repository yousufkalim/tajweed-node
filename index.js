/**
 * Tajweed Node js
 * @author Shuja Naqvi
 */
require("dotenv").config();

const util = require("util");
const app = require("express")();
const User = require("./models/Users");
const port = process.env.PORT || 5000;
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const session = require("express-session");
// After you declare "app"
app.use(session({ secret: "melody hensley is my spirit animal" }));
// require("./utils/passport");
require("./database");
const jwt = require("jsonwebtoken");
const tokenSecret = process.env.JWT_SECRET;

// Middleware
require("./middleware/common")(app);

// API Routes
app.use("/api", require("./routes"));

// Server
app.listen(port, () => {
  console.log(`Server is running at port ${port} :)`);
});

// app.use(passport.initialize());
// app.use(passport.session());

// app.get("/api/auth/facebook", passport.authenticate("facebook"));

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FB_Client_ID,
//       clientSecret: process.env.FB_Client_Secret,
//       callbackURL: process.env.FACEBOOK_CALLBACK,
//     },
//     async function (accessToken, refreshToken, profile, cb) {
//       console.log(profile.email, "profile");
//       await User.findOne({ email: profile.email }, function (err, user) {
//         return cb(err, user);
//       });
//     }
//   )
// );

// app.get(
//   "/api/auth/facebook/callback",
//   passport.authenticate("facebook", { failureRedirect: "/login" }),
//   async function (req, res) {
//     // Successful authentication, redirect home.
//     const email = req.user.email;
//     const user = await User.findOne({ email: email });
//     if (user) {
//       const payload = { user };
//       // Generating token
//       jwt.sign(payload, tokenSecret, { expiresIn: 360000 }, (err, token) => {
//         if (err) throw err;

//         // done
//         res.json({ success: true, user, token });
//       });
//     } else {
//       let newUser = await User.create({
//         email: email,
//       });
//       jwt.sign(payload, tokenSecret, { expiresIn: 360000 }, (err, token) => {
//         if (err) throw err;
//         // done
//         res.json({ success: true, newUser, token });
//       });
//     }
//   }
// );

// app.get(
//   "/api/auth/google",
//   passport.authenticate("google", { scope: ["email", "profile"] })
// );
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GCP_CLIENT_ID,
//       clientSecret: process.env.GCP_CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_CALLBACK,
//       passReqToCallback: true,
//     },
//     async function (request, accessToken, refreshToken, profile, done) {
//       await User.findOne({ email: profile.email }, function (err, user) {
//         return done(err, user);
//       });
//     }
//   )
// );

// app.get(
//   "/api/auth/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "/api/auth/google/failure",
//   }),
//   async function (req, res) {
//     // Successful authentication, redirect home.
//     const email = req.user.email;
//     const user = await User.findOne({ email: email });
//     if (user) {
//       const payload = { user };
//       // Generating token
//       jwt.sign(payload, tokenSecret, { expiresIn: 360000 }, (err, token) => {
//         if (err) throw err;

//         // done
//         res.json({ success: true, user, token });
//       });
//     } else {
//       let newUser = await User.create({
//         email: email,
//       });
//       jwt.sign(payload, tokenSecret, { expiresIn: 360000 }, (err, token) => {
//         if (err) throw err;
//         // done
//         res.json({ success: true, newUser, token });
//       });
//     }
//   }
// );
