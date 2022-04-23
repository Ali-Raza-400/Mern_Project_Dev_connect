const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
//import the models
const User = require('../../models/User');
const config = require('config');

// @route POST api/users
// @desc Resgister User
// @access Public

router.post(
  '/',
  [
    check('name', 'name is required').not().isEmpty(),
    check('email', 'please include valid Email').isEmail(),
    check('password', 'password should be atleast  6 character').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // if any of filed is unfilled or have error than if satatement executes
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // we destruct all filed so instead of typing req.body.name,req.body.email we do below

    const { name, email, password } = req.body;
    try {
      //See if User Exists

      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'user already exists' }] });
      }

      // Get Users Gravatar

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      //creating the instance of the user var
      user = new User({
        name,
        email,
        avatar,
        password,
      });
      // Encrypt password

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      // Return jsonWebToken
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.send({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
