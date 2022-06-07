import React, { useCallback, useEffect, useReducer } from 'react';
import { connectToDataSource, disconnectAll, OnNewData } from '../utils/bluetooth';

type State = {
  name?: string;
  isConnected: boolean;
  isPaused: boolean;
  isFake: boolean;
  isRecording: boolean;
};

type BooleanSetting = keyof Omit<State, 'name'>;
type ToggleAction = { type: 'toggle'; field: BooleanSetting };
type SetAction = {
  type: 'set';
  values: Partial<State>;
};

type Action = ToggleAction | SetAction;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'toggle':
      console.log('in toggle reducer', state[action.field])
      return { ...state, [action.field]: !state[action.field] };
    case 'set':
      return { ...state, ...action.values };
  }
};

type SetCall = (values: Partial<State>) => void;

interface Context extends State {
  toggle(field: BooleanSetting): void;
  set: SetCall;
  connect(onNewData: OnNewData): void;
  disconnect(): void;
}

const INITIAL_STATE: State = {
  isConnected: false,
  isPaused: true,
  isFake: false,
  isRecording: true,
};

export const DataSourceContext = React.createContext<Context>({
  ...INITIAL_STATE,
  toggle: () => {},
  set: () => {},
  connect: () => {},
  disconnect: () => {}
});

const DataSourceContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  let [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const toggle = useCallback((field: BooleanSetting) => {
    console.log('inside toggle?')
    dispatch({ type: 'toggle', field });
  }, []);

  const set = useCallback<SetCall>((values) => {
    dispatch({ type: 'set', values });
  }, []);

  const connect = useCallback(async (onNewData: OnNewData) => {
    let result = await connectToDataSource(onNewData, state.isFake);

    if (result.success) {
      set({ isConnected: true, isPaused: false, name: result.name });
    } else {
      set({ isConnected: false });
    }
  }, [state.isFake, set]);

  const disconnect = useCallback(() => {
    disconnectAll();
    set({ isConnected: false, name: undefined });
  }, [set]);

  useEffect(() => {
    if (!state.isConnected) {
      set({ isPaused: false });
    }
  }, [state.isConnected, set]);

  return (
    <DataSourceContext.Provider value={{ ...state, set, toggle, connect, disconnect }}>
      {children}
    </DataSourceContext.Provider>
  );
};

export default DataSourceContextProvider;
