const express= require('express');
const router=express.Router();
const auth =require('../../middleware/auth')
const User =require('../../models/User')
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const config =require('config');
const bcrypt = require('bcryptjs');


// @route Get api/auth
// @desc Test route 
// @access Public 

router.get('/',auth,async(req,res)=>{
    try{
            const user=await User.findById(req.user.id).select('-password')
            res.json(user)
    }
    catch(err){
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

// login user
// @route POST api/
// @desc Authentication user and get token
// @access Public

router.post(
    '/',
    [
      
      check('email', 'please include valid Email').isEmail(),
      check('password', 'password is required').exists()
    ],
    async (req, res) => {
      const errors = validationResult(req);
      // if any of filed is unfilled or have error than if satatement executes
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // we destruct all filed so instead of typing req.body.name,req.body.email we do below
  
      const {  email, password } = req.body;
      try {
        //See if User Exists
  
        let user = await User.findOne({ email });
        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }
  
        // comparing password
        const isMatch =await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }
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

module.exports =router;