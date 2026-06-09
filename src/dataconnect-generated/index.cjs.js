const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs, makeMemoryCacheProvider } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'sga-upanema',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;
const dataConnectSettings = {
  cacheSettings: {
    cacheProvider: makeMemoryCacheProvider()
  }
};
exports.dataConnectSettings = dataConnectSettings;

const createUserAccountRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUserAccount', inputVars);
}
createUserAccountRef.operationName = 'CreateUserAccount';
exports.createUserAccountRef = createUserAccountRef;

exports.createUserAccount = function createUserAccount(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createUserAccountRef(dcInstance, inputVars));
}
;

const createFolderRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateFolder', inputVars);
}
createFolderRef.operationName = 'CreateFolder';
exports.createFolderRef = createFolderRef;

exports.createFolder = function createFolder(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createFolderRef(dcInstance, inputVars));
}
;

const listUserFilesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListUserFiles', inputVars);
}
listUserFilesRef.operationName = 'ListUserFiles';
exports.listUserFilesRef = listUserFilesRef;

exports.listUserFiles = function listUserFiles(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listUserFilesRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const logUserActionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'LogUserAction', inputVars);
}
logUserActionRef.operationName = 'LogUserAction';
exports.logUserActionRef = logUserActionRef;

exports.logUserAction = function logUserAction(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(logUserActionRef(dcInstance, inputVars));
}
;
