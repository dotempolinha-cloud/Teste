# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateUserAccount, useCreateFolder, useListUserFiles, useLogUserAction } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateUserAccount(createUserAccountVars);

const { data, isPending, isSuccess, isError, error } = useCreateFolder(createFolderVars);

const { data, isPending, isSuccess, isError, error } = useListUserFiles(listUserFilesVars);

const { data, isPending, isSuccess, isError, error } = useLogUserAction(logUserActionVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createUserAccount, createFolder, listUserFiles, logUserAction } from '@dataconnect/generated';


// Operation CreateUserAccount:  For variables, look at type CreateUserAccountVars in ../index.d.ts
const { data } = await CreateUserAccount(dataConnect, createUserAccountVars);

// Operation CreateFolder:  For variables, look at type CreateFolderVars in ../index.d.ts
const { data } = await CreateFolder(dataConnect, createFolderVars);

// Operation ListUserFiles:  For variables, look at type ListUserFilesVars in ../index.d.ts
const { data } = await ListUserFiles(dataConnect, listUserFilesVars);

// Operation LogUserAction:  For variables, look at type LogUserActionVars in ../index.d.ts
const { data } = await LogUserAction(dataConnect, logUserActionVars);


```