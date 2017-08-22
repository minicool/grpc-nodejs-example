
var grpc = require('grpc');
const implementation = require('./implementation');

const config_file = 'config.json';
const config_path = require('path').join(__dirname,'../../','config',config_file);
const { host, port } = require(config_path).client_conf;

var proto_path = require('path').join(__dirname,'../../../','proto');
const proto_file = 'example.proto';
const proto = grpc.load({root:proto_path,file:proto_file});

// get the Client Class
const Client_type = proto.employer.EmployerService;
//const EmployerListResponse = proto.employer.EmployerListResponse;
// create a new client instance
const client = new Client_type(`${host}:${port}`, grpc.credentials.createInsecure());

//client add
//implementation.getEmployerAll(client); 
//implementation.getEmployerList(client);
implementation.getEmployerMap(client);
//implementation.getEmployer(client);
//implementation.addEmployerImage(client);
//implementation.getEmployerImage(client);
