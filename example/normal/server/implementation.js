const fs = require('fs');
const data = require('../../resource/employer');

module.exports = {
    getEmployer: function (call, callback) {
        const md = call.metadata.getMap();      
        for (let key in md) {
            console.log(key, md[key]);
        }

        const employerId = call.request.employerId;
        const uLength = data.employees.length;

/*         data.employees.forEach(function (employer) {
            console.log(employer);           
            if (employerId === employer.employerId){
                let employer_data = employer;
                callback(null,{employer:employer_data});
                return;
            }
        }); */
        for (let i = 0; i < uLength; i++) {
            if (data.employees[i].employerId === employerId) {
                callback(null, { employer: data.employees[i] });
                return;
            }
        }
        callback('cannt found id');
    },
    getEmployerList: function (call, callback) {
        const md = call.metadata.getMap();      
        for (let key in md) {
            console.log(key, md[key]);
        }

        const employerIndex = call.request.employerIndex;
        const employerCount = call.request.employerCount;
        const uLength = data.employees.length;   
        
        if (uLength < employerIndex + employerCount)
            callback('can not index');     

        const employer_data = [];
        for (let i = 0; i < uLength; i++) {
            if (i >= employerIndex && i< (employerIndex + employerCount)) {
                employer_data.push(data.employees[i]);
            }
            console.log(employer_data);
        }
        callback(null, { employers: employer_data});               
    },
    getEmployerMap: function (call, callback) {
        const md = call.metadata.getMap();      
        for (let key in md) {
            console.log(key, md[key]);
        }
        var employerMap;
        data.employees.forEach(function (employer) {
            console.log(employer);
 //           employerMap[employer.name] = employer;
        });
        callback(null, { employerMap: employerMap});
    },  
    getEmployerAll: function (call, callback) {
        const md = call.metadata.getMap();      
        for (let key in md) {
            console.log(key, md[key]);
        }
        data.employees.forEach(function (employer) {
            console.log(employer);
            call.write({ employers: employer });
        });

        call.end();
    },    
    addEmployerImage: function (call, callback) {
        const md = call.metadata.getMap();
        for (let key in md) {
            console.log(key, md[key]);
        }

        let result = new Buffer(0);      
        call.on('data', function (data) {
            if (data.employerId != 0){
                console.log(data.employerId,data.picName);   
            }         
            result = Buffer.concat([result, data.picData]);
            console.log(`Message received with size ${data.picData.length}`);
        });
        call.on('end', function () {
            callback(null, { isSuccesd: true });
            console.log(`Total file size: ${result.length} bytes`);
        });
    },
    getEmployerImage: function (call, callback) {
        const md = call.metadata.getMap();
        for (let key in md) {
            console.log(key, md[key]);
        }

        const employerId = call.request.employerId;
        const uLength = data.employees.length;

        let fileName;
        for (let i = 0; i < uLength; i++) {
            if (data.employees[i].employerId === employerId) {
                fileName = data.employees[i].picName;
                console.log(fileName);
                call.write({ picName: data.employees[i].picName });
                break;
            }
        }

        const fliePath = __dirname+'/../../resource/'+fileName;
        console.log(fliePath);
        const stream = fs.createReadStream(fliePath);
        stream.on("data", function (chunk) {
            call.write({picData: chunk});
        });
        stream.on("end", function () {
            call.end();
        });
    }
}