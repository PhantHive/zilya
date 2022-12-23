import * as mysql from 'mysql';
import {ExtendedInteraction} from "../../../typings/SlashCommand";

export class sqlPhearion {

    constructor(interaction: ExtendedInteraction) {
        this.connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        console.log(`mySql connection established by ${interaction.user.tag}`)
    }

    connection: mysql.Connection;

    async getBankInfos(userName: string ) {
        console.log(`Getting bank infos for ${userName}`)
        return new Promise(async (resolve, reject) => {
            await this.connection.query(`SELECT * FROM eco_accounts WHERE player_name = "${userName}" `, async (err, res) => {
                if (err) return reject('Something went wrong. Report it to administrator.');
                if (res.length === 0) return reject('User not found.');
                await resolve(res[0]);

            });

        });
    }

    async transferMoney(userName: string, amount: number) {

        this.connection.query(`UPDATE eco_accounts SET money = ${amount} WHERE player_name = '${userName}'`, (err) => {
            if (err) return console.log(err);
        })

        // commit changes with rollback
        await this.connection.commit((err) => {
            if (err) {
                return this.connection.rollback(() => {
                    throw err;
                });
            }
            console.log('Transaction Complete.');
            this.connection.end();
        });
    }
}

