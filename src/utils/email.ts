import ejs from "ejs";
import nodemailer from "nodemailer";
import path from "path";
import { envVars } from "../config/env";

const transporter = nodemailer.createTransport({
    host: envVars.EMAIL_SENDER.SMTP_HOST,
    secure: true,
    auth: {
        user: envVars.EMAIL_SENDER.SMTP_USER,
        pass: envVars.EMAIL_SENDER.SMTP_PASS,
    },
    port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
});

interface SendEmailOptions {
    to: string;
    subject: string;
    templateName: string;
    templateData: Record<string, unknown>;
    attachments?: {
        filename: string;
        content: Buffer | string;
        contentType: string;
    }[];
}

export const sendEmail = async ({
    subject,
    templateData,
    templateName,
    to,
    attachments,
}: SendEmailOptions): Promise<void> => {
    try {
        const templatePath = path.resolve(
            process.cwd(),
            `src/templates/${templateName}.ejs`
        );

        const html = await ejs.renderFile(templatePath, templateData);

        await transporter.sendMail({
            from: envVars.EMAIL_SENDER.SMTP_FROM,
            to,
            subject,
            html,
            attachments: attachments?.map((a) => ({
                filename: a.filename,
                content: a.content,
                contentType: a.contentType,
            })),
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Email could not be sent: ${message}`);
    }
};
