const moment = require("moment");
const Contact = require("../models/Contact");
const joi = require("../validation/contact");
// const nodemailer = require("nodemailer");
const commonFunc = require("./common");

// const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     secure: true,
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

module.exports = {
    createContact(input, context) {
        return new Promise(async (resolve) => {
            try {
                const validation = joi.createContact(input);
                if (validation.error) {
                    return resolve({
                        error: validation.error,
                        severity: "error",
                        message: "Please fix fields in red below.",
                    });
                } else {
                    const {
                        name,
                        email,
                        mobile,
                        subject,
                        message,
                    } = validation.value;
                    const now = moment(new Date()).format("YYYY-MM-DD");
                    const prepareInput = {
                        name,
                        email,
                        mobile,
                        subject,
                        message,
                        createdAt: now,
                    };
                    // Send email to admin
                    // await transporter.sendMail({
                    //     from: `"${name}" <${email}>`,
                    //     to: process.env.ADMIN_EMAIL,
                    //     subject: `New Contact Form: ${subject}`,
                    //     html: `
                    //         <p><strong>Name:</strong> ${name}</p>
                    //         <p><strong>Email:</strong> ${email}</p>
                    //         <p><strong>Mobile:</strong> ${mobile}</p>
                    //         <p><strong>Subject:</strong> ${subject}</p>
                    //         <p><strong>Message:</strong> ${message}</p>
                    //     `,
                    // });
                    // Insert the record
                    return new Contact({
                        ...prepareInput
                    })
                        .save()
                        .then((response) =>
                            resolve({
                                error: null,
                                hasError: null,
                                severity: response ? "success" : "error",
                                message: response
                                    ? "Thanks for contact us. we will get back to you soon"
                                    : "Something went wrong. try again",
                            })
                        )
                        .catch((error) => {
                            return resolve({
                                error: error,
                                hasError: error,
                                severity: "error",
                                message: "Something went wrong! try again",
                            });
                        });
                }
            } catch (ex) {
                return resolve({
                    error: null,
                    hasError: ex,
                    severity: "error",
                    message: "Something went wrong!",
                });
            }
        });
    },
    list(context) {
        return new Promise(async (resolve) => {
            try {
                const sort = {
                    id: 1,
                };
                const { response } = await commonFunc.queryExecutor(
                    { sort },
                    Contact
                );
                return resolve({ response });
            }catch(error){
                return resolve({
                    error: null,
                    hasError: error,
                    severity: "error",
                    message: "Something went wrong!",
                });
            }
            
        });
    },
};
