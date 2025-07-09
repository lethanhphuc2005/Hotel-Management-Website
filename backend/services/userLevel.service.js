const User = require('../models/user.model'); 
const { determineUserLevel } = require('../utils/levelUtils');

const updateUserLevel = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const newLevel = determineUserLevel(user.total_spent, user.total_bookings);
  console.log(`Updating user level for ${user.email}: ${user.level} -> ${newLevel}`);
  if (newLevel !== user.level) {
    user.level = newLevel;
    await user.save();
    return newLevel;
  }

  return user.level;
};

module.exports = {
  updateUserLevel,
};