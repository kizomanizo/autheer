async function success(_req, res, status, message) {
  try {
    res.status(status).json({
      success: true,
      message: message,
    });
  } catch (error) {
    failure(res, 500, "Internal server error!");
  }
}

async function failure(_req, res, status, message) {
  try {
    res.status(status).json({
      success: false,
      message: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error!",
    });
  }
}

module.exports = { success, failure };
