import Nodemailer from "nodemailer";
import {MailtrapClient} from "mailtrap"
/*   UNUSED RN */

const sendEmail = async (options) => {
    console.log("Sending email...");
    const TOKEN = "792dd958e25525ca40cf5ebbf4c6945d";

    const transport = Nodemailer.createTransport(
        MailtrapTransport({
            token: TOKEN,
            testInboxId: 999999,
        })
    );

    const sender = {
        address: "hello@demomailtrap.com",
        name: "Mailtrap Test",
    };
    const recipients = [
        "wardistitan@gmail.com",
    ];

    transport
        .sendMail({
            from: sender,
            to: recipients,
            template_uuid: "example",
            template_variables: {
                "URL": "Test_URL"
            },
            sandbox: true
        })
        .then(console.log, console.error);
}
export default sendEmail;
