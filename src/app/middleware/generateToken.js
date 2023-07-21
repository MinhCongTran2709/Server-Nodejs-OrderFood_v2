var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config()

function generateToken(account) {
    const payload = {
        id: account._id,
        phoneNumber: account.phoneNumber,
        role: account.role
    }

    const token = jwt.sign(
        payload,
        process.env.token_secret_key,
        {expiresIn: "1h"}
    )
    
    return token
}

module.exports = generateToken;