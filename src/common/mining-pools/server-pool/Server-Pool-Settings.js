import InterfaceSatoshminDB from 'common/satoshmindb/Interface-SatoshminDB';
import consts from 'consts/const_global';

class PoolSettings {

    constructor(poolManagement, databaseName){

        this.poolManagement = poolManagement;
        this._db = new InterfaceSatoshminDB( databaseName ? databaseName : consts.DATABASE_NAMES.SERVER_POOL_DATABASE );

        this._serverPoolFee = 0;

    }

    async initializeServerPoolSettings(){

        return await this._getPoolDetails();

    }

    get serverPoolFee(){

        return this._serverPoolFee;
    }

    setServerPoolFee(newValue){

        this._serverPoolFee = newValue;

        return this.savePoolDetails();
    }

    async validatePoolDetails(){

        if ( typeof this._serverPoolFee !== "number") throw {message: "ServerPool fee is invalid"};
        if ( this._serverPoolFee < 0 && this._serverPoolFee > 1 ) throw {message: "ServerPool fee is invalid"};

    }

    async savePoolDetails(){

        await this.validatePoolDetails();

        let result = await this._db.save("serverPool_fee", this._serverPoolFee);

        return  result;
    }

    async _getPoolDetails(){

        try {

            this._serverPoolFee = await this._db.get("serverPool_fee", 30 * 1000, true);

            if (this._serverPoolFee === null)
                this._serverPoolFee = 0;

            this._serverPoolFee = parseFloat(this._serverPoolFee);



        } catch (exception){

        }

        await this.validatePoolDetails();

    }

}

export default PoolSettings;