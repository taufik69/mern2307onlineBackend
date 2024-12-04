const bcrypt = require("bcrypt");
const encryptPassword = async (plainPassoword) => {
  try {
    const hashPasword = await bcrypt.hash(plainPassoword, 10);
    return hashPasword;
  } catch (error) {
    console.log("Error from encryptPassword ", error);
  }
};

const decreptedPassword = async (plainPassoword, encryptedPass) => {
  try {
    return await bcrypt.compare(plainPassoword, encryptedPass);
  } catch (error) {
    console.log("Error from decreptedPassword ", error);
  }
};

module.exports = { encryptPassword, decreptedPassword };
