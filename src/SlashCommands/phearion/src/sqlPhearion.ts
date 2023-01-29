import * as mysql from 'mysql2/promise';

import {ExtendedInteraction} from "../../../typings/SlashCommand";


export class sqlPhearion {

    constructor(interaction: ExtendedInteraction) {
        this.connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        this.connectionPerms = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME_PERMS
        });

        console.log(`mySql connection established by ${interaction.user.tag}`)
    }

    connection: Promise<mysql.Connection>;
    connectionPerms: Promise<mysql.Connection>;

    async getBankInfos(userName: string ) {
        console.log(`Getting bank infos for ${userName}`)
        let info = null;
        try{
            // start transaction
            await (await this.connection).beginTransaction();

            await (await this.connection).query(`SELECT *FROM eco_accounts WHERE player_name = "${userName}" `)
                .then((result) => {
                    info = result[0][0];
                });

            // commit changes
            await (await this.connection).commit();
        }
        catch (err) {
            throw "Problème lors de la récupération des infos.";
        } finally {
            // close connection
            await (await this.connection).end();
        }

        return info;
    }

    async transferMoney(userName: string, amount: number) {
        try {
            // start transaction
            await (await this.connection).beginTransaction();

            // update user's account balance
            await (await this.connection).query(`UPDATE eco_accounts SET money = ${amount}WHERE player_name = '${userName}'`);

            // commit changes
            await (await this.connection).commit();
            console.log('Transaction Complete.');
        } catch (err) {
            // rollback changes if there is an error
            await (await this.connection).rollback();
            console.log(err);
            throw "Problème lors du transfère d'argent.";
        } finally {
            // close connection
            await (await this.connection).end();
        }
    }

    async addProperty(userName: string, property: string) {

        try {
            // start transaction
            await (await this.connectionPerms).beginTransaction();

            console.log(userName)
            let res = await (await this.connectionPerms).query(`SELECT uuid
                                                                FROM luckperms_players
                                                                WHERE username = '${userName.toLowerCase()}';`);

            let uuid = res[0][0].uuid;
            await (await this.connectionPerms).query(`INSERT INTO luckperms_user_permissions (id, uuid, permission, value, server, world, expiry, contexts)
                               VALUES (NULL, '${uuid}', 'group.${property}', 1, 'global', 'global', 0,
                                       '{}');`)


            // commit changes
            await (await this.connectionPerms).commit();
            console.log('Transfère de propriété effectué.');

        }
        catch (err) {
            // rollback changes if there is an error
            await (await this.connectionPerms).rollback();
            console.log(err);
            throw "Problème lors du transfère de propriété.";
        } finally {
            // close connection
            await (await this.connectionPerms).end();
        }

    }

}