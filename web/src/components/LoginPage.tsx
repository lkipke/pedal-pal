import React, { ChangeEvent, useCallback, useContext, useState } from "react";
import { Button, Pane, Text, TextInput } from "evergreen-ui";
import { login } from "../api";
import { UserContext } from "../providers/UserContext";

type OnChangeEvent = ChangeEvent<HTMLInputElement>;

const LoginPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const { setUser } = useContext(UserContext);

  const onLogInClicked = useCallback(async () => {
    setIsLoading(true);

    let result = await login(username, password);
    if (result.success) {
      setUser(result.user);
    } else {
      setErrorMessage('Invalid username or password. Please try again.');
    }

    setIsLoading(false);
  }, [username, password]);

  return (
    <Pane
      display='flex'
      justifyContent='center'
      alignItems='center'
      flexDirection='column'
    >
      <TextInput
        placeholder='username'
        onChange={(e: OnChangeEvent) => setUsername(e.target.value)}
      />
      <TextInput
        placeholder='password'
        hidden={true}
        onChange={(e: OnChangeEvent) => setPassword(e.target.value)}
      />
      <Button onClick={onLogInClicked} disabled={isLoading}>Log in</Button>
      {errorMessage && <Text color="red">{errorMessage}</Text>}
    </Pane>
  );
};

export default LoginPage;
