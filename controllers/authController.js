const db = require("../utils/initializeDataBase");

exports.login = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await db.user.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send("user does not exists");
    }

    return res.status(200).json({ id: user.id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
