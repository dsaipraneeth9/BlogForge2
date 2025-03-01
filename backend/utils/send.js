import nodemailer from "nodemailer";

export async function send({ subject, to, text, html }) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'minerva.king83@ethereal.email',
            pass: 'NeCPavZ65x6wm435Jh'
        }
    });

    await transporter.sendMail({
        from: 'kaylin.schneider46@ethereal.email',
        to: to,
        subject: subject,
        text: text,
        html: html,
    });
}