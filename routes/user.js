import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Key from "../config/key.js";
// import passport from 'passport' ;
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";
import loginValidate from "../validation/login.js";
import registerValidate from "../validation/register.js";
import LastLogin from "../models/LastLogin.js";
import User from "../models/user.model.js";
import Employee from "../models/excelUpload.js";

dotenv.config();
const HOST = process.env.SMTP_HOST;
const PORT = process.env.SMTP_PORT;
const USER = process.env.SMTP_USER;
const PASS = process.env.SMTP_PASS;

const determineRoleFromDesignation = (designation) => {
  // Your logic to determine the role based on the designation
  // For example, if designation is "DEV", return "admin"
  // If designation is "SUPERADMIN", return "superadmin"
  // Otherwise, return "analyst"

  const adminDesignations = ["PROJECT MANAGER"];
  const superAdminDesignation = "SUPERADMIN";

  if (adminDesignations.includes(designation.toUpperCase())) {
    return "admin";
  } else if (designation.toUpperCase() === superAdminDesignation) {
    return "superadmin";
  } else {
    return "analyst";
  }
};

router.post("/register", async (req, res) => {
  try {
    const { errors, isValid } = registerValidate(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Check if the email already exists in the user database
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res
        .status(400)
        .json({ emailAlready: "Email already registered" });
    }

    // Check if the email exists in the employee database
    const existingEmployee = await Employee.findOne({
      email_id: req.body.email,
    });

    if (!existingEmployee) {
      return res
        .status(400)
        .json({ emailNotFound: "Email not found in employee database" });
    }

    // Determine the role based on the employee's designation
    const role = determineRoleFromDesignation(existingEmployee.designation);

    // Proceed with user registration
    const newUser = new User({
      name: req.body.name,
      empId: req.body.empId,
      role: role,
      email: req.body.email,
      password: req.body.password,
    });

    // Hash the password before saving it to the database
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, async (err, hash) => {
        if (err) {
          console.log(err);
          throw err;
        }
        newUser.password = hash;

        // Save the new user to the user database
        try {
          const savedUser = await newUser.save();
          res.json(savedUser);
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Internal server error" });
        }
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//   const LastLogin = require('../models/LastLogin');

router.route("/login").post(async (req, res) => {
  try {
    const { errors, isValid } = loginValidate(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // Check if it's the superadmin login
    if (
      email === "superadmin@objectways.com" &&
      password === "superadmin@123"
    ) {
      const payload = {
        id: "superadmin", // You can use a unique identifier for the superadmin
        name: "Super Admin",
        email: "superadmin@objectways.com",
        empId: "superadmin",
        role: "superadmin",
      };

      jwt.sign(
        payload,
        Key.key,
        {
          expiresIn: 900,
        },
        (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token,
          });
        }
      );
    } else {
      // If it's not a superadmin login, proceed with the existing logic
      const existingEmployee = await Employee.findOne({ email_id: email });

      if (!existingEmployee) {
        return res
          .status(400)
          .json({ emailNotFound: "Email not found in Employee database" });
      }

      User.findOne({ email }).then((user) => {
        if (!user) {
          return res.status(404).json({ emailNotFound: "Email Not Found" });
        }

        const role = determineRoleFromDesignation(existingEmployee.designation);

        bcrypt.compare(password, user.password).then(async (isMatch) => {
          if (isMatch) {
            try {
              const lastLogin = new LastLogin({
                userId: user._id,
                loginTime: new Date(),
              });

              await lastLogin.save();

              user.lastLogin = lastLogin._id;

              await user.save();

              const payload = {
                id: user.id,
                name: user.name,
                email: user.email,
                empId: user.empId,
                role: role,
              };

              jwt.sign(
                payload,
                Key.key,
                {
                  expiresIn: 900,
                },
                (err, token) => {
                  res.json({
                    success: true,
                    token: "Bearer " + token,
                  });
                }
              );
            } catch (error) {
              console.error(error);
              res.status(500).json({ message: "Internal server error" });
            }
          } else {
            return res
              .status(400)
              .json({ passwordIncorrect: "Password Incorrect" });
          }
        });
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.route("/users").get((req, res) => {
  User.find({}, "name")
    .sort([["name", 1]])
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Error:" + err));
});
router.route("/all").get((req, res) => {
  User.find({}, "empId")
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Error:" + err));
});

router.route("/last-login").get(async (req, res) => {
  try {
    const lastLogins = await LastLogin.find().populate("userId", "name email"); // Assuming you have a reference to the user in LastLogin model

    res.json(lastLogins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.route("/forget").post((req, res) => {
    const { email } = req.body;
    var transporter = nodemailer.createTransport({
        host: HOST,
        port:PORT,
        auth: {
          user: USER,
          pass: PASS
        },tls: {
                    rejectUnauthorized: false
                },
      });
  
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        console.log(err);
      }
      const token = buffer.toString("hex");
      User.findOne({ email }).then((user) => {
        if (!user) {
          return res.status(404).json("User Not Found in the Database");
        }
        user.resetToken = token;
        user.expireToken = Date.now() + 300000;
        user
          .save()
          .then(() => {
            transporter.sendMail({
                to: user.email,
                from: "Team Developers <coder@objectways.com>",
                subject: "Password Reset Request 🔑",
                html: `
                        <div class="es-wrapper-color">
            <!--[if gte mso 9]>
                <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                    <v:fill type="tile" color="#07023c"></v:fill>
                </v:background>
            <![endif]-->
            <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
                <tbody>
                    <tr>
                        <td class="esd-email-paddings" valign="top">
                            <table class="es-content esd-header-popover" cellspacing="0" cellpadding="0" align="center">
                                <tbody>
                                    <tr>
                                        <td class="esd-stripe" align="center">
                                            <table class="es-content-body" style="background-color: #ffffff; background-image: url(https://tlr.stripocdn.email/content/guids/CABINET_0e8fbb6adcc56c06fbd3358455fdeb41/images/vector_0Ia.png); background-repeat: no-repeat; background-position: center center;" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" background="https://tlr.stripocdn.email/content/guids/CABINET_0e8fbb6adcc56c06fbd3358455fdeb41/images/vector_0Ia.png">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure es-p20t es-p10b es-p20r es-p20l" align="left">
                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                <tbody>
                                                                    <tr>
                                                                        <td width="560" class="es-m-p0r esd-container-frame" align="top" align="center">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="center" class="esd-block-image" style="font-size: 0px;"><img src="https://demo.stripocdn.email/content/guids/1666ada9-0df7-4d86-bab9-abd9cfb40541/images/objectways1.png" alt="Logo" style="display: block;" title="Logo" height="55"></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="esd-structure es-p30t es-p30b es-p20r es-p20l" align="left">
                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="es-m-p0r es-m-p20b esd-container-frame" width="560" align="top" align="center">
                                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="center" class="esd-block-text">
                                                                                            <h1>&nbsp;We got a request to reset your&nbsp;password</h1>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="center" class="esd-block-image es-p15t es-p10b" style="font-size: 0px;"><img class="adapt-img" src="https://tlr.stripocdn.email/content/guids/CABINET_dee64413d6f071746857ca8c0f13d696/images/852converted_1x3.png" alt style="display: block;" height="300"></td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="center" class="esd-block-text es-p10t es-p10b">
                                                                                            <p>&nbsp;Forgot your password? No problem - it happens to everyone!</p>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="center" class="esd-block-button es-p15t es-p15b" style="padding: 0;margin: 0;padding-top: 15px;padding-bottom: 15px;" ><span class="es-button-border" style="border-style: solid solid solid solid;border-color: #26C6DA #26C6DA #26C6DA #26C6DA;background: #26C6DA;border-width: 4px 4px 4px 4px;display: inline-block;border-radius: 10px;width: auto;"><a href="http://localhost:3000/authentication/reset/${token}" class="es-button" target="_blank" style="font-weight: normal;-webkit-text-size-adjust: none;-ms-text-size-adjust: none;mso-line-height-rule: exactly;text-decoration: none !important;color: #ffffff;font-size: 20px;border-style: solid;border-color: #26C6DA;border-width: 10px 25px 10px 30px;display: inline-block;background: #26C6DA;border-radius: 10px;font-family: arial, 'helvetica neue', helvetica, sans-serif;font-style: normal;line-height: 120%;width: auto;text-align: center;mso-style-priority: 100 !important;"> Reset Your Password</a></span></td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="center" class="esd-block-text es-p10t es-p10b">
                                                                                            <p>If you ignore this message, your password won't be changed.</p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table cellpadding="0" cellspacing="0" class="es-content" align="center">
                                <tbody>
                                    <tr>
                                        <td class="esd-stripe" align="center">
                                            <table bgcolor="#10054D" class="es-content-body" align="center" cellpadding="0" cellspacing="0" width="600" style="background-color: #10054d;">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure es-p35t es-p35b es-p20r es-p20l" align="left" background="https://tlr.stripocdn.email/content/guids/CABINET_0e8fbb6adcc56c06fbd3358455fdeb41/images/vector_sSY.png" style="background-image: url(https://tlr.stripocdn.email/content/guids/CABINET_0e8fbb6adcc56c06fbd3358455fdeb41/images/vector_sSY.png); background-repeat: no-repeat; background-position: left center;">
                                                            <!--[if mso]><table width="560" cellpadding="0" cellspacing="0"><tr><td width="69" valign="top"><![endif]-->
                                                            <table cellpadding="0" cellspacing="0" class="es-left" align="left">
                                                                <tbody>
                                                                    <tr>
                                                                        <td width="69" class="es-m-p20b esd-container-frame" align="left">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="center" class="esd-block-image es-m-txt-l" style="font-size: 0px;"><a target="_blank" href="https://viewstripo.email"><img src="https://tlr.stripocdn.email/content/guids/CABINET_dee64413d6f071746857ca8c0f13d696/images/group_118_lFL.png" alt style="display: block;" width="69"></a></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <!--[if mso]></td><td width="20"></td><td width="471" valign="top"><![endif]-->
                                                            <table cellpadding="0" cellspacing="0" class="es-right" align="right">
                                                                <tbody>
                                                                    <tr>
                                                                        <td width="471" align="left" class="esd-container-frame">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="left" class="esd-block-text">
                                                                                            <h3 style="color: #ffffff;"><b>Here to help.</b></h3>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="left" class="esd-block-text es-p10t es-p5b">
                                                                                            <p style="color: #ffffff;">Have a question? Just mail : coder@objectways.com.</p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <!--[if mso]></td></tr></table><![endif]-->
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table cellpadding="0" cellspacing="0" class="esd-footer-popover es-footer" align="center">
                                <tbody>
                                    <tr>
                                        <td class="esd-stripe" align="center">
                                            <table class="es-footer-body" align="center" cellpadding="0" cellspacing="0" width="600" style="background-color: transparent;">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure es-p20" align="left">
                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                <tbody>
                                                                    <tr>
                                                                        <td width="560" class="esd-container-frame" align="center" valign="top">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="center" class="esd-empty-container" style="display: none;"></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
                        `,
            });
            res.json({ message: "check your email" });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
          });
      });
    });
  });

router.route("/reset").post((req, res) => {
  const newPass = req.body.password;
  const email = req.body.email;
  const sendToken = req.body.token;

  User.findOne({ resetToken: sendToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .json("Token Has been expired so Please try again");
      }
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newPass, salt, (err, hash) => {
          if (err) {
            console.log(err);
          }
          user.password = hash;
          user.resetToken = undefined;
          user.expireToken = undefined;
          user
            .save()
            .then((user) =>
              res.json(
                "Your New Password Has been updated please login with new password"
              )
            )
            .catch((err) => console.log(err));
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

export default router;
