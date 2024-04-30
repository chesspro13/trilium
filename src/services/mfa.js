const speakeasy = require("speakeasy");

function verifyOTPToken(guessedToken) {
  console.log("[" + guessedToken + "]");
  console.log(typeof guessedToken);

  const tokenValidates = speakeasy.totp.verify({
    secret: process.env.MFA_SECRET,
    encoding: "base32",
    token: guessedToken,
    window: 1,
  });

  return tokenValidates;
}

module.exports = {
  verifyOTPToken,
};
