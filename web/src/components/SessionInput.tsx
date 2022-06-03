import { Button, Pane, Popover, Text, TextInput } from 'evergreen-ui';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { createSession } from '../api';
import { Session } from '../api/types';

interface Props {
  currentSessionName?: string;
  setCurrentSession: React.Dispatch<React.SetStateAction<Session | null>>;
}

const SessionInput: React.FC<Props> = ({
  currentSessionName,
  setCurrentSession,
}) => {
  const now = new Date().toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
  });
  const [name, setName] = useState('');

  const createNewSession = useCallback(async () => {
    let newSession = await createSession(name || now);
    setCurrentSession(newSession);
  }, [name, now, setCurrentSession]);

  return (
    <Pane display='flex'>
      <Text margin={10}>
        {`Current session: ${currentSessionName || 'None found'}`}
      </Text>
      <Popover
        minHeight={46}
        content={({ close }) => (
          <Pane display='flex' alignItems='center' marginTop={7}>
            <Text marginLeft={10} marginRight={10}>
              Name:
            </Text>
            <TextInput
              marginRight={10}
              placeholder={now}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
            ></TextInput>
            <Button
              marginRight={10}
              onClick={() => {
                close();
                createNewSession();
              }}
            >
              Create session
            </Button>
          </Pane>
        )}
      >
        <Button>New session</Button>
      </Popover>
    </Pane>
  );
};

export default SessionInput;
