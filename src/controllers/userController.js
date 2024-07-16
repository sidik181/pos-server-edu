import Users from "../services/userAccount.js";

const getProfile = (req, res, next) => {
  try {
    const userId = req.user.sessionId;

    const user = Users.find((user) => user.uuid === userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;

    res.json({
      message: "success",
      data: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

const getCashier = (req, res, next) => {
  try {
    let cashier = Users.filter((user) => user.role === "cashier");
    let count = cashier.length;

    return res.status(200).json({ data: cashier, count });
  } catch (error) {
    next(error);
  }
};

export default {
  getCashier,
  getProfile,
};
