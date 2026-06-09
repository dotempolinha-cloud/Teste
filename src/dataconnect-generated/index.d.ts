import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface ActivityLog_Key {
  id: UUIDString;
  __typename?: 'ActivityLog_Key';
}

export interface CreateFolderData {
  folder_insert: Folder_Key;
}

export interface CreateFolderVariables {
  name: string;
  ownerId: UUIDString;
  parentFolderId?: UUIDString | null;
}

export interface CreateUserAccountData {
  user_insert: User_Key;
}

export interface CreateUserAccountVariables {
  email: string;
  displayName: string;
}

export interface File_Key {
  id: UUIDString;
  __typename?: 'File_Key';
}

export interface Folder_Key {
  id: UUIDString;
  __typename?: 'Folder_Key';
}

export interface ListUserFilesData {
  files: ({
    id: UUIDString;
    name: string;
    sizeBytes: Int64String;
    mimeType?: string | null;
  } & File_Key)[];
}

export interface ListUserFilesVariables {
  ownerId: UUIDString;
}

export interface LogUserActionData {
  activityLog_insert: ActivityLog_Key;
}

export interface LogUserActionVariables {
  userId: UUIDString;
  actionType: string;
  targetFileId?: UUIDString | null;
}

export interface Share_Key {
  id: UUIDString;
  __typename?: 'Share_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateUserAccountRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserAccountVariables): MutationRef<CreateUserAccountData, CreateUserAccountVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserAccountVariables): MutationRef<CreateUserAccountData, CreateUserAccountVariables>;
  operationName: string;
}
export const createUserAccountRef: CreateUserAccountRef;

export function createUserAccount(vars: CreateUserAccountVariables): MutationPromise<CreateUserAccountData, CreateUserAccountVariables>;
export function createUserAccount(dc: DataConnect, vars: CreateUserAccountVariables): MutationPromise<CreateUserAccountData, CreateUserAccountVariables>;

interface CreateFolderRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateFolderVariables): MutationRef<CreateFolderData, CreateFolderVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateFolderVariables): MutationRef<CreateFolderData, CreateFolderVariables>;
  operationName: string;
}
export const createFolderRef: CreateFolderRef;

export function createFolder(vars: CreateFolderVariables): MutationPromise<CreateFolderData, CreateFolderVariables>;
export function createFolder(dc: DataConnect, vars: CreateFolderVariables): MutationPromise<CreateFolderData, CreateFolderVariables>;

interface ListUserFilesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListUserFilesVariables): QueryRef<ListUserFilesData, ListUserFilesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListUserFilesVariables): QueryRef<ListUserFilesData, ListUserFilesVariables>;
  operationName: string;
}
export const listUserFilesRef: ListUserFilesRef;

export function listUserFiles(vars: ListUserFilesVariables, options?: ExecuteQueryOptions): QueryPromise<ListUserFilesData, ListUserFilesVariables>;
export function listUserFiles(dc: DataConnect, vars: ListUserFilesVariables, options?: ExecuteQueryOptions): QueryPromise<ListUserFilesData, ListUserFilesVariables>;

interface LogUserActionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: LogUserActionVariables): MutationRef<LogUserActionData, LogUserActionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: LogUserActionVariables): MutationRef<LogUserActionData, LogUserActionVariables>;
  operationName: string;
}
export const logUserActionRef: LogUserActionRef;

export function logUserAction(vars: LogUserActionVariables): MutationPromise<LogUserActionData, LogUserActionVariables>;
export function logUserAction(dc: DataConnect, vars: LogUserActionVariables): MutationPromise<LogUserActionData, LogUserActionVariables>;

