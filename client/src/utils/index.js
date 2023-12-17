import { Buffer } from 'buffer';

const randomString = (length) => {
    let text = "";
    const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const clientIdBase64 = () => {
    return Buffer.from(randomString(10)).toString("base64");
};

export { clientIdBase64 };