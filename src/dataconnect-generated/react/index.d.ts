import { CreateUserAccountData, CreateUserAccountVariables, CreateFolderData, CreateFolderVariables, ListUserFilesData, ListUserFilesVariables, LogUserActionData, LogUserActionVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUserAccount(options?: useDataConnectMutationOptions<CreateUserAccountData, FirebaseError, CreateUserAccountVariables>): UseDataConnectMutationResult<CreateUserAccountData, CreateUserAccountVariables>;
export function useCreateUserAccount(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserAccountData, FirebaseError, CreateUserAccountVariables>): UseDataConnectMutationResult<CreateUserAccountData, CreateUserAccountVariables>;

export function useCreateFolder(options?: useDataConnectMutationOptions<CreateFolderData, FirebaseError, CreateFolderVariables>): UseDataConnectMutationResult<CreateFolderData, CreateFolderVariables>;
export function useCreateFolder(dc: DataConnect, options?: useDataConnectMutationOptions<CreateFolderData, FirebaseError, CreateFolderVariables>): UseDataConnectMutationResult<CreateFolderData, CreateFolderVariables>;

export function useListUserFiles(vars: ListUserFilesVariables, options?: useDataConnectQueryOptions<ListUserFilesData>): UseDataConnectQueryResult<ListUserFilesData, ListUserFilesVariables>;
export function useListUserFiles(dc: DataConnect, vars: ListUserFilesVariables, options?: useDataConnectQueryOptions<ListUserFilesData>): UseDataConnectQueryResult<ListUserFilesData, ListUserFilesVariables>;

export function useLogUserAction(options?: useDataConnectMutationOptions<LogUserActionData, FirebaseError, LogUserActionVariables>): UseDataConnectMutationResult<LogUserActionData, LogUserActionVariables>;
export function useLogUserAction(dc: DataConnect, options?: useDataConnectMutationOptions<LogUserActionData, FirebaseError, LogUserActionVariables>): UseDataConnectMutationResult<LogUserActionData, LogUserActionVariables>;
