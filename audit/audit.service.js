
const db = require('_helpers/db');
const Audit = db.Audit;

module.exports = {
    getAllAudits
  
};


async function getAllAudits() {

console.log("reached");
     return  Audit.find({}).populate("user");
//return {timestamp:new Date(),ip:"11.111.111.111"}

}

