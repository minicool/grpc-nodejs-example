const fs = require('fs');
const grpc = require('grpc');
const data = require('../../resource/employer');

module.exports = {
    getEmployer: function (client) {
        const md = new grpc.Metadata();
        md.add("funcation", "getEmployer"); 

        client.getEmployer({ employerId:2 }, md, function (err, response) {
            if (err)
                console.log(err);
            else
                console.log(response);
        });
    },    
    getEmployerList: function (client) {
        const md = new grpc.Metadata();
        md.add("funcation", 'getEmployerList');

        client.getEmployerList({ employerIndex:0,employerCount:2 },md,function (err, response) {
            if (err)
                console.log(err);
            else
                console.log(response);
        });
    },    
    getEmployerMap: function (client) {
        const md = new grpc.Metadata();
        md.add("funcation", 'getEmployerMap');

        client.getEmployerMap({},md,function (err, response) {
            if (err)
                console.log(err);
            else
                console.log(response);
        });
    },   
    getEmployerAll: function (client) {
        const md = new grpc.Metadata();
        md.add("funcation", 'getEmployerAll');

        const call = client.getEmployerAll({},md);

        call.on('data', function (data) {
            console.log(data);
        });
    },
    addEmployerImage: function (client) {
        const md = new grpc.Metadata();
        md.add("funcation", "addEmployerImage");

        const fileName = 'test.jpeg';
        const call = client.addEmployerImage(md, function (err, result) {
            console.log(result);
        });
        call.write({employerId:1,picName:fileName});
        const fliePath = __dirname+'/'+fileName;
        console.log(fliePath);
        const stream = fs.createReadStream(fliePath);
        stream.on("data", function (chunk) {
            call.write({picData: chunk});
        });
        stream.on("end", function () {
            call.end();
        });
    },
    getEmployerImage: function (client) {
        const md = new grpc.Metadata();
        md.add("funcation", "getEmployerImage");

        let fileName = undefined;
        const call = client.getEmployerImage({employerId:2},md);

        let stream = undefined;
        call.on('data', function (data) {
            if(fileName === undefined){
                fileName = data.picName;               
            }
            if(fileName !== undefined && stream === undefined) {
                console.log(__dirname+'/'+fileName);
                stream = fs.createWriteStream(__dirname+'/'+fileName);
            }
            if(stream !== undefined){
                stream.write(data.picData);
                console.log(data.picData);
            }
        });

        call.on("end", function () {
            stream.end();
        }); 
    }
};
