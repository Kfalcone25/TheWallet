var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");

const Tracker = require("../models/Tracker");
const Wallet = require("../models/Wallet");
const User = require("../models/User.model")

const { isLoggedIn } = require("../middleware/route-gaurd");

router.get("/add-wallet", (req, res, next) => {
  let username = req.session.user;
  res.render("wallet/add-wallet.hbs", username);
});

router.post("/add-wallet", isLoggedIn, (req, res, next) => {
  const { name, description, initialBudget } = req.body;
  console.log(name);
  Wallet.create({
    name,
    description,
    initialBudget,
    owner: req.session.user._id,
  })
    .then((createdWallet) => {
      console.log("New Wallet:", createdWallet);
      res.redirect(`/wallet/all-wallets`);
    })
    .catch((err) => {
      console.log("New Wallet failed -", err);
    });
});

router.get("/all-wallets", (req, res, next) => {
  Wallet.find({
    owner: req.session.user._id,
  })
    .then((wallets) => {
      console.log(wallets);
      res.render("wallet/all-wallets.hbs", { wallets });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/wallet-details/:id", (req, res, next) => {
  Wallet.findById(req.params.id)
    .populate("trackers")
    .then((foundWallet) => {
      console.log(foundWallet);
      res.render("wallet/wallet-details.hbs", foundWallet);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/edit-wallet/:id", (req, res, next) => {
  Wallet.findById(req.params.id)
    .populate("owner")
    .then((foundWallet) => {
      res.render("wallet/edit-wallet.hbs", foundWallet);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/edit-wallet/:id", isLoggedIn, (req, res, next) => {
  const { name, description, initialBudget } = req.body;

  console.log("budget", initialBudget)
  Wallet.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      initialBudget,
    },
    { new: true }
  )
    .then((updatedWallet) => {
      console.log("Updated Wallet", updatedWallet);
      res.redirect(`/wallet/wallet-details/${updatedWallet._id}`);
    })
    .catch((err) => {
      console.log(err);
    });
});


router.post("/add-tracker/:id", isLoggedIn, (req, res, next) => {
  const { description, value, expense } = req.body

  const {id} = req.params

  Tracker.create({
    description,
    value,
    expense,
    wallet: id
})
  .then((createdTracker) => {
    console.log("created tracker: ", createdTracker)
    
    Wallet.findByIdAndUpdate(
      id,
      {
        $push: {trackers: createdTracker._id}
      },
      { new: true }
    )
    .then((updatedWallet) => {
      console.log("Updated Wallet: ", updatedWallet)
      res.redirect(`/wallet/wallet-details/${updatedWallet._id}`);
  })
  .catch((err) => {
    console.log(err)
  })
  })
})

router.get("/delete/:id", (req, res, next) => {
  const {id} = req.params

  Tracker.findByIdAndDelete(
    id
  )
  .then((deletedTracker) => {
    console.log("Deleted", deletedTracker.wallet)

    Wallet.findByIdAndUpdate(
      deletedTracker.wallet,
      {
        $pull: {trackers: deletedTracker._id}
      },
      { new: true }
    )
    .then((updatedWallet) => {
      console.log("Updated: ", updatedWallet)
      res.redirect(`/wallet/wallet-details/${updatedWallet._id}`);
    })
  })
})

router.get("/delete-wallet/:id", (req, res, next) => {

  Wallet.findByIdAndDelete(
    req.params.id
  )
  .then(() =>{
    res.redirect("/wallet/all-wallets")
  })
  
})

router.get("/edit-tracker/:id", (req, res, next) => {
  Tracker.findById(req.params.id)
    .then((foundTracker) => {
      res.render("wallet/edit-tracker.hbs", foundTracker);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/edit-tracker/:id", isLoggedIn, (req, res, next) => {
  const { expense, description, value } = req.body;

  Tracker.findByIdAndUpdate(
    req.params.id,
    {
      expense,
      description,
      value,
    },
    { new: true }
  )
    .then((updatedTracker) => {
      console.log("Updated Tracker", updatedTracker);
      res.redirect(`/wallet/wallet-details/${updatedTracker.wallet}`);
    })
    .catch((err) => {
      console.log(err);
    });
});
module.exports = router;
