/**
 * Tajweed Node js
 * @author Shuja Naqvi
 */
require("dotenv").config();
const app = require("express")();
const User = require("./models/Users");
const port = process.env.PORT || 5000;
// const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");
const session = require("express-session");
// After you declare "app"
app.use(session({ secret: "melody hensley is my spirit animal" }));
require("./utils/passport");
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

app.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", {
    successReturnToOrRedirect: "/api/auth/google/success",
    failureRedirect: "/api/auth/google/failure",
  })
);

app.get("/api/auth/google/success", async (req, res) => {
  console.log("XYZ");
  try {
    const profile = req.user;
    const email = req.user.emails[0].value;
    const user = await User.findOne({ email: email });
    if (user) {
      const payload = { user };
      // Generating token
      jwt.sign(payload, tokenSecret, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;

        // done
        res.json({ success: true, user, token });
      });
    } else {
      let newUser = await User.create({
        name: profile.name.givenName + profile.name.familyName,
        email: email,
      });
      jwt.sign(payload, tokenSecret, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        // done
        res.json({ success: true, user, token });
      });
    }
  } catch (error) {
    console.log("err", error);
    return res.redirect(process.env.REACT_URL);
  }
});

app.get("/api/auth/google/failure", async (req, res) => {
  console.log("hi failed");
  // return res.send({ req: req, res: res });
});

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: "351494413149636",
//       clientSecret: "6dc8c994fa5b86cf78acc0372d4177b6",
//       callbackURL: "http://localhost:9190/auth/facebook/callback",
//     },
//     async function (accessToken, refreshToken, profile, cb) {
//       await User.findOne({ email: profile.email }, function (err, user) {
//         return cb(err, user);
//       });
//     }
//   )
// );

// app.get("/api/v1/auth/facebook", passport.authenticate("facebook"));

// app.get(
//   "/api/v1/auth/facebook/callback",
//   passport.authenticate("facebook", { failureRedirect: "/login" }),
//   function (req, res) {
//     // Successful authentication, redirect home.
//     res.json({ success: true, user: req });
//   }
// );
