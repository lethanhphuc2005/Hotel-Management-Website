function determineUserLevel(totalSpent, totalBookings) {
  if (totalSpent >= 50000000 || totalBookings >= 10) return "diamond";
  if (totalSpent >= 30000000) return "gold";
  if (totalSpent >= 10000000) return "silver";
  if (totalSpent >= 3000000) return "bronze";
  return "newbie";
}

function getLevelDiscount(level) {
  switch (level) {
    case "diamond":
      return 0.15;
    case "gold":
      return 0.1;
    case "silver":
      return 0.05;
    case "bronze":
      return 0.02;
    default:
      return 0;
  }
}

module.exports = {
  determineUserLevel,
  getLevelDiscount,
};
