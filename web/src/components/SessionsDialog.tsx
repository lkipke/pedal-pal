import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Button,
  DeleteIcon,
  Dialog,
  Pane,
  Paragraph,
  Table,
  Text,
  TrashIcon,
} from 'evergreen-ui';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { deleteSession, getSessionById, getSessions, Session } from '../api';
import { BluetoothData, OnNewData } from '../utils/bluetooth';

interface Props {
  setCurrentSession(session: Session, clearOldData?: boolean): void;
  setCurrentData(newData: BluetoothData[], disableRecord?: boolean): void;
}

const PAGE_SIZE = 2;

const SessionsDialog: React.FC<Props> = ({
  setCurrentSession,
  setCurrentData,
}) => {
  const [isShown, setIsShown] = useState(false);
  const prevShown = useRef(false);
  const [pageOffset, setPageOffset] = useState(0);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [allSessionsRetrieved, setAllSessionsRetrieved] = useState(false);
  const [totalSessions, setTotalSessions] = useState<number>(0);

  const requestSessions = useCallback(
    async (newOffset: number) => {
      let response = await getSessions(PAGE_SIZE, newOffset);
      if (!response.success) {
        if (response.errorCode === 'ALL_SESSIONS_RETRIEVED') {
          setAllSessionsRetrieved(true);
        } else {
          console.error('error fetching sessions', response.errorMsg);
        }
        return;
      }

      setPageOffset(newOffset);
      setSessions(response.sessions);
      setTotalSessions(response.total);
    },
    [pageOffset]
  );

  const onNextClicked = useCallback(() => {
    requestSessions(pageOffset + 1);
  }, [pageOffset]);

  const onPrevClicked = useCallback(() => {
    requestSessions(pageOffset - 1);
  }, [pageOffset]);

  const onDeleteClicked = useCallback(
    (sessionId: string) => {
      deleteSession(sessionId).then(() => {
        if (pageOffset * PAGE_SIZE + sessions.length >= totalSessions) {
          requestSessions(pageOffset - 1);
        } else {
          requestSessions(pageOffset);
        }
      });
    },
    [pageOffset, sessions?.length]
  );

  const retrieveSession = useCallback(
    async (sessionId: string) => {
      let session = await getSessionById(sessionId);
      if (session) {
        setCurrentSession(session.session, true);
        setCurrentData(session.data, true);
      }
    },
    [setCurrentData, setCurrentSession]
  );

  useEffect(() => {
    if (isShown && !prevShown.current) {
      requestSessions(0);
    }
    prevShown.current = isShown;
  }, [isShown, requestSessions]);

  useEffect(() => {
    setAllSessionsRetrieved(
      pageOffset * PAGE_SIZE + PAGE_SIZE >= totalSessions
    );
  }, [pageOffset, totalSessions]);

  return (
    <Pane>
      <Dialog
        isShown={isShown}
        title='All sessions'
        onCloseComplete={() => setIsShown(false)}
        width='80%'
        hasFooter={false}
      >
        {({ close }) => (
          <>
            <Table>
              <Table.Head>
                <Table.SearchHeaderCell />
                <Table.Cell maxWidth={100} />
                <Table.TextHeaderCell>Last updated</Table.TextHeaderCell>
                <Table.TextHeaderCell>Grafana</Table.TextHeaderCell>
              </Table.Head>
              {sessions && (
                <Table.Body>
                  {sessions.map((session) => (
                    <Table.Row
                      key={session.id}
                      isSelectable
                      onSelect={() =>
                        retrieveSession(session.id).then(() => close())
                      }
                    >
                      <Table.Cell maxWidth={100}>
                        <Pane
                          display='flex'
                          alignItems='center'
                          alignContent='center'
                          height='100%'
                          marginLeft={15}
                        >
                          <Button onClick={() => onDeleteClicked(session.id)}>
                            <TrashIcon color='red' />
                          </Button>
                        </Pane>
                      </Table.Cell>
                      <Table.TextCell>{session.name}</Table.TextCell>
                      <Table.TextCell>
                        {new Date(session.updatedAt).toLocaleString()}
                      </Table.TextCell>
                      <Table.TextCell isNumber>123</Table.TextCell>
                    </Table.Row>
                  ))}
                </Table.Body>
              )}
            </Table>
            <Pane float='right' marginTop={20} marginBottom={15}>
              <Text marginRight={10} paddingRight={10}>
                Total sessions: {totalSessions}
              </Text>
              <Button onClick={onPrevClicked} disabled={pageOffset <= 0}>
                <ArrowLeftIcon marginRight={5} /> Previous
              </Button>
              <Button
                onClick={onNextClicked}
                marginLeft={5}
                disabled={allSessionsRetrieved}
              >
                Next <ArrowRightIcon marginLeft={5} />
              </Button>
            </Pane>
          </>
        )}
      </Dialog>

      <Button onClick={() => setIsShown(true)}>See all sessions</Button>
    </Pane>
  );
};

export default SessionsDialog;
