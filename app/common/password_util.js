const bcrypt = require("bcrypt");

/**
 * This class contains utility methods for password management.
 */
class PasswordUtil {
  // Function to hash a password
  async hashPassword(plainTextPassword) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(plainTextPassword, saltRounds);
    return hash;
  }

  // Function to compare a plain text password with a hash
  async comparePassword(plainTextPassword, hash) {
    return await bcrypt.compare(plainTextPassword, hash);
  }
}

module.exports = new PasswordUtil();
