'use strict'

const apiHandler = (payload, context, callback) => {
    console.log(`Function apiHandler called with payload ${JSON.stringify(payload)}`);
    callback(null, {
        statusCode: 201,
        body: payload.body + ' - From Lambda <3'
    }); 
}
    
module.exports = {
    apiHandler,
}