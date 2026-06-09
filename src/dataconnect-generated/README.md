# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListUserFiles*](#listuserfiles)
- [**Mutations**](#mutations)
  - [*CreateUserAccount*](#createuseraccount)
  - [*CreateFolder*](#createfolder)
  - [*LogUserAction*](#loguseraction)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListUserFiles
You can execute the `ListUserFiles` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listUserFiles(vars: ListUserFilesVariables, options?: ExecuteQueryOptions): QueryPromise<ListUserFilesData, ListUserFilesVariables>;

interface ListUserFilesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListUserFilesVariables): QueryRef<ListUserFilesData, ListUserFilesVariables>;
}
export const listUserFilesRef: ListUserFilesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUserFiles(dc: DataConnect, vars: ListUserFilesVariables, options?: ExecuteQueryOptions): QueryPromise<ListUserFilesData, ListUserFilesVariables>;

interface ListUserFilesRef {
  ...
  (dc: DataConnect, vars: ListUserFilesVariables): QueryRef<ListUserFilesData, ListUserFilesVariables>;
}
export const listUserFilesRef: ListUserFilesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUserFilesRef:
```typescript
const name = listUserFilesRef.operationName;
console.log(name);
```

### Variables
The `ListUserFiles` query requires an argument of type `ListUserFilesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListUserFilesVariables {
  ownerId: UUIDString;
}
```
### Return Type
Recall that executing the `ListUserFiles` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUserFilesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListUserFilesData {
  files: ({
    id: UUIDString;
    name: string;
    sizeBytes: Int64String;
    mimeType?: string | null;
  } & File_Key)[];
}
```
### Using `ListUserFiles`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUserFiles, ListUserFilesVariables } from '@dataconnect/generated';

// The `ListUserFiles` query requires an argument of type `ListUserFilesVariables`:
const listUserFilesVars: ListUserFilesVariables = {
  ownerId: ..., 
};

// Call the `listUserFiles()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUserFiles(listUserFilesVars);
// Variables can be defined inline as well.
const { data } = await listUserFiles({ ownerId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUserFiles(dataConnect, listUserFilesVars);

console.log(data.files);

// Or, you can use the `Promise` API.
listUserFiles(listUserFilesVars).then((response) => {
  const data = response.data;
  console.log(data.files);
});
```

### Using `ListUserFiles`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUserFilesRef, ListUserFilesVariables } from '@dataconnect/generated';

// The `ListUserFiles` query requires an argument of type `ListUserFilesVariables`:
const listUserFilesVars: ListUserFilesVariables = {
  ownerId: ..., 
};

// Call the `listUserFilesRef()` function to get a reference to the query.
const ref = listUserFilesRef(listUserFilesVars);
// Variables can be defined inline as well.
const ref = listUserFilesRef({ ownerId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUserFilesRef(dataConnect, listUserFilesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.files);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.files);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUserAccount
You can execute the `CreateUserAccount` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUserAccount(vars: CreateUserAccountVariables): MutationPromise<CreateUserAccountData, CreateUserAccountVariables>;

interface CreateUserAccountRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserAccountVariables): MutationRef<CreateUserAccountData, CreateUserAccountVariables>;
}
export const createUserAccountRef: CreateUserAccountRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUserAccount(dc: DataConnect, vars: CreateUserAccountVariables): MutationPromise<CreateUserAccountData, CreateUserAccountVariables>;

interface CreateUserAccountRef {
  ...
  (dc: DataConnect, vars: CreateUserAccountVariables): MutationRef<CreateUserAccountData, CreateUserAccountVariables>;
}
export const createUserAccountRef: CreateUserAccountRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserAccountRef:
```typescript
const name = createUserAccountRef.operationName;
console.log(name);
```

### Variables
The `CreateUserAccount` mutation requires an argument of type `CreateUserAccountVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserAccountVariables {
  email: string;
  displayName: string;
}
```
### Return Type
Recall that executing the `CreateUserAccount` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserAccountData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserAccountData {
  user_insert: User_Key;
}
```
### Using `CreateUserAccount`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUserAccount, CreateUserAccountVariables } from '@dataconnect/generated';

// The `CreateUserAccount` mutation requires an argument of type `CreateUserAccountVariables`:
const createUserAccountVars: CreateUserAccountVariables = {
  email: ..., 
  displayName: ..., 
};

// Call the `createUserAccount()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUserAccount(createUserAccountVars);
// Variables can be defined inline as well.
const { data } = await createUserAccount({ email: ..., displayName: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUserAccount(dataConnect, createUserAccountVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUserAccount(createUserAccountVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUserAccount`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserAccountRef, CreateUserAccountVariables } from '@dataconnect/generated';

// The `CreateUserAccount` mutation requires an argument of type `CreateUserAccountVariables`:
const createUserAccountVars: CreateUserAccountVariables = {
  email: ..., 
  displayName: ..., 
};

// Call the `createUserAccountRef()` function to get a reference to the mutation.
const ref = createUserAccountRef(createUserAccountVars);
// Variables can be defined inline as well.
const ref = createUserAccountRef({ email: ..., displayName: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserAccountRef(dataConnect, createUserAccountVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## CreateFolder
You can execute the `CreateFolder` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createFolder(vars: CreateFolderVariables): MutationPromise<CreateFolderData, CreateFolderVariables>;

interface CreateFolderRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateFolderVariables): MutationRef<CreateFolderData, CreateFolderVariables>;
}
export const createFolderRef: CreateFolderRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createFolder(dc: DataConnect, vars: CreateFolderVariables): MutationPromise<CreateFolderData, CreateFolderVariables>;

interface CreateFolderRef {
  ...
  (dc: DataConnect, vars: CreateFolderVariables): MutationRef<CreateFolderData, CreateFolderVariables>;
}
export const createFolderRef: CreateFolderRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createFolderRef:
```typescript
const name = createFolderRef.operationName;
console.log(name);
```

### Variables
The `CreateFolder` mutation requires an argument of type `CreateFolderVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateFolderVariables {
  name: string;
  ownerId: UUIDString;
  parentFolderId?: UUIDString | null;
}
```
### Return Type
Recall that executing the `CreateFolder` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateFolderData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateFolderData {
  folder_insert: Folder_Key;
}
```
### Using `CreateFolder`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createFolder, CreateFolderVariables } from '@dataconnect/generated';

// The `CreateFolder` mutation requires an argument of type `CreateFolderVariables`:
const createFolderVars: CreateFolderVariables = {
  name: ..., 
  ownerId: ..., 
  parentFolderId: ..., // optional
};

// Call the `createFolder()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createFolder(createFolderVars);
// Variables can be defined inline as well.
const { data } = await createFolder({ name: ..., ownerId: ..., parentFolderId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createFolder(dataConnect, createFolderVars);

console.log(data.folder_insert);

// Or, you can use the `Promise` API.
createFolder(createFolderVars).then((response) => {
  const data = response.data;
  console.log(data.folder_insert);
});
```

### Using `CreateFolder`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createFolderRef, CreateFolderVariables } from '@dataconnect/generated';

// The `CreateFolder` mutation requires an argument of type `CreateFolderVariables`:
const createFolderVars: CreateFolderVariables = {
  name: ..., 
  ownerId: ..., 
  parentFolderId: ..., // optional
};

// Call the `createFolderRef()` function to get a reference to the mutation.
const ref = createFolderRef(createFolderVars);
// Variables can be defined inline as well.
const ref = createFolderRef({ name: ..., ownerId: ..., parentFolderId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createFolderRef(dataConnect, createFolderVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.folder_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.folder_insert);
});
```

## LogUserAction
You can execute the `LogUserAction` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
logUserAction(vars: LogUserActionVariables): MutationPromise<LogUserActionData, LogUserActionVariables>;

interface LogUserActionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: LogUserActionVariables): MutationRef<LogUserActionData, LogUserActionVariables>;
}
export const logUserActionRef: LogUserActionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
logUserAction(dc: DataConnect, vars: LogUserActionVariables): MutationPromise<LogUserActionData, LogUserActionVariables>;

interface LogUserActionRef {
  ...
  (dc: DataConnect, vars: LogUserActionVariables): MutationRef<LogUserActionData, LogUserActionVariables>;
}
export const logUserActionRef: LogUserActionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the logUserActionRef:
```typescript
const name = logUserActionRef.operationName;
console.log(name);
```

### Variables
The `LogUserAction` mutation requires an argument of type `LogUserActionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface LogUserActionVariables {
  userId: UUIDString;
  actionType: string;
  targetFileId?: UUIDString | null;
}
```
### Return Type
Recall that executing the `LogUserAction` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `LogUserActionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface LogUserActionData {
  activityLog_insert: ActivityLog_Key;
}
```
### Using `LogUserAction`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, logUserAction, LogUserActionVariables } from '@dataconnect/generated';

// The `LogUserAction` mutation requires an argument of type `LogUserActionVariables`:
const logUserActionVars: LogUserActionVariables = {
  userId: ..., 
  actionType: ..., 
  targetFileId: ..., // optional
};

// Call the `logUserAction()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await logUserAction(logUserActionVars);
// Variables can be defined inline as well.
const { data } = await logUserAction({ userId: ..., actionType: ..., targetFileId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await logUserAction(dataConnect, logUserActionVars);

console.log(data.activityLog_insert);

// Or, you can use the `Promise` API.
logUserAction(logUserActionVars).then((response) => {
  const data = response.data;
  console.log(data.activityLog_insert);
});
```

### Using `LogUserAction`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, logUserActionRef, LogUserActionVariables } from '@dataconnect/generated';

// The `LogUserAction` mutation requires an argument of type `LogUserActionVariables`:
const logUserActionVars: LogUserActionVariables = {
  userId: ..., 
  actionType: ..., 
  targetFileId: ..., // optional
};

// Call the `logUserActionRef()` function to get a reference to the mutation.
const ref = logUserActionRef(logUserActionVars);
// Variables can be defined inline as well.
const ref = logUserActionRef({ userId: ..., actionType: ..., targetFileId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = logUserActionRef(dataConnect, logUserActionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.activityLog_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.activityLog_insert);
});
```

