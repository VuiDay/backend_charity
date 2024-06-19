class Helper {
    static random(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }
    static generateOrderCode() {
        const timestamp = Date.now().toString();
        const randomNumber = Math.floor(Math.random() * 100);
        const orderCode = timestamp + randomNumber.toString();
        return parseInt(orderCode);
    }
}


module.exports = Helper