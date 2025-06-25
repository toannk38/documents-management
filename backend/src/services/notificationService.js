const sendNotification = async (userId, message) => {
  // Integrate with email, SMS, or push notification system
  // Placeholder: log to console
  console.log(`Notify user ${userId}: ${message}`);
};

const sendBulkNotification = async (userIds, message) => {
  for (const userId of userIds) {
    await sendNotification(userId, message);
  }
};

module.exports = {
  sendNotification,
  sendBulkNotification,
};
