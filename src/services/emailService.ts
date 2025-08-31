import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

export const sendPasswordResetEmail = async (to: string, resetLink: string) => {
    const mailOptions = {
        from: 'no-reply@todo-app.com',
        to,
        subject: 'Redefinição de Senha - To-Do App',
        html: `
            <h1>Redefinição de Senha</h1>
            <p>Você solicitou a redefinição de senha.</p>
            <p>Clique no link abaixo para definir uma nova senha:</p>
            <a href="${resetLink}">Redefinir Senha</a>
            <p>Este link é válido por 1 hora.</p>
            <p>Se você não solicitou esta redefinição, ignore este email.</p>
        `
    };

    return transporter.sendMail(mailOptions);
};
