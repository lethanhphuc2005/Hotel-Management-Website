const Wallet = require("../models/wallet.model");

const walletController = {
  // === LẤY THÔNG TIN VÍ THEO USER ID ===
  getWalletByUserId: async (req, res) => {
    try {
      const { userId } = req.params;
      let wallet = await Wallet.findOne({ user_id: userId });

      if (!wallet) {
        wallet = await Wallet.create({ user_id: userId });
      }

      // Populate transactions with type information
      wallet = await wallet.populate(
        "user_id",
        "first_name last_name email phone_number"
      );

      res.status(200).json({
        message: "Lấy thông tin ví thành công",
        data: wallet,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === HOÀN TIỀN VÀO VÍ ===
  refundToWallet: async (req, res) => {
    try {
      const { userId } = req.params;
      const { amount, note } = req.body;

      if (!amount || amount <= 0) {
        return res
          .status(400)
          .json({ message: "Số tiền hoàn trả không hợp lệ" });
      }

      let wallet = await Wallet.findOne({ user_id: userId });

      if (!wallet) {
        wallet = await Wallet.create({ user_id: userId });
      }

      wallet.balance += amount;
      wallet.transactions.push({
        type: "refund",
        amount,
        note,
      });

      await wallet.save();

      res.status(200).json({
        message: "Hoàn tiền vào ví thành công",
        data: wallet,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === SỬ DỤNG TIỀN TRONG VÍ ===
  useFromWallet: async (req, res) => {
    try {
      const { userId } = req.params;
      const { amount, note } = req.body;

      if (!amount || amount <= 0) {
        return res
          .status(400)
          .json({ message: "Số tiền sử dụng không hợp lệ" });
      }

      let wallet = await Wallet.findOne({ user_id: userId });

      if (!wallet) {
        return res.status(404).json({ message: "Ví không tồn tại" });
      }

      if (wallet.balance < amount) {
        return res.status(400).json({ message: "Số dư không đủ" });
      }

      wallet.balance -= amount;
      wallet.transactions.push({
        type: "use",
        amount,
        note,
      });

      await wallet.save();

      res.status(200).json({
        message: "Sử dụng tiền trong ví thành công",
        data: wallet,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  refundInternal: async (userId, amount, note = "") => {
    let wallet = await Wallet.findOne({ user_id: userId });
    if (!wallet) wallet = await Wallet.create({ user_id: userId, balance: 0 });

    wallet.balance += amount;
    wallet.transactions.push({
      type: "refund",
      amount,
      note,
      date: new Date(),
    });

    await wallet.save();
    return wallet;
  },
};

module.exports = walletController;
