import { Button, Pane, Popover, Text, TextInput } from 'evergreen-ui';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { createSession, getLastSession } from '../api';
import { Session, User } from '../api/types';

interface SessionInputProps {
  currentSessionName?: string;
  setCurrentSession: React.Dispatch<React.SetStateAction<Session | null>>;
}

const SessionInput: React.FC<SessionInputProps> = ({
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
  }, []);

  return (
    <>
      {currentSessionName ? (
        <Text>Current session: {currentSessionName}</Text>
      ) : (
        <Text>No current session</Text>
      )}
      <Popover
        minHeight={46}
        content={({ close }) => (
          <Pane
            display='flex'
            alignItems='center'
            marginTop={7}
          >
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
    </>
  );
};

interface Props {
  user: User;
}

const MetricsPage: React.FC<Props> = ({ user }) => {
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  useEffect(() => {
    getLastSession().then(setCurrentSession);
  }, []);

  return (
    <Pane
      display='flex'
      justifyContent='center'
      alignItems='center'
      flexDirection='column'
    >
      <SessionInput
        setCurrentSession={setCurrentSession}
        currentSessionName={currentSession?.name}
      />
    </Pane>
  );
};

export default MetricsPage;
