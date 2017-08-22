var grpc = require('grpc');
const implementation = require('./implementation');

const config_file = "config.json";
const config_path = require('path').join(__dirname,'../../','config',config_file);
const { host, port } = require(config_path).server_conf;

var proto_path = require('path').join(__dirname,'../../../','proto');
const proto_file = 'example.proto';
const proto = grpc.load({root:proto_path,file:proto_file})

// create Server
const server = new grpc.Server();
server.addService(
    proto.employer.EmployerService.service, // select the service
    {getEmployer:implementation.getEmployer,
        getEmployerList:implementation.getEmployerList,
        getEmployerMap:implementation.getEmployerMap,
        getEmployerAll:implementation.getEmployerAll,
        addEmployerImage:implementation.addEmployerImage,
        getEmployerImage:implementation.getEmployerImage} // service implementations
);

// start server with the given config, without security
server.bind(`${host}:${port}`, grpc.ServerCredentials.createInsecure());
server.start();
console.log('grpc server running at port: '+`${host}:${port}`);
