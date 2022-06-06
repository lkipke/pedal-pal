import React, { useEffect, useReducer } from 'react';

type ToggleableState = 'isConnected' | 'isPaused' | 'isFake' | 'isRecording';
type Context = Record<ToggleableState, boolean> & {
  name?: string;
};

const INITIAL_STATE: Context = {
  isConnected: false,
  isPaused: true,
  isFake: false,
  isRecording: true,
};

type ToggleAction = { type: 'toggle'; field: ToggleableState };
type SetAction =
  | { type: 'set'; field: ToggleableState; value: boolean }
  | { type: 'set'; field: 'name'; value: string | null | undefined };

type Action = ToggleAction | SetAction;

const reducer = (state: Context, action: Action): Context => {
  switch (action.type) {
    case 'toggle':
      return { ...state, [action.field]: !state[action.field] };
    case 'set':
      return { ...state, [action.field]: action.value };
  }
};

export const DataSourceContext = React.createContext<Context>(INITIAL_STATE);

const DataSourceContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  let [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    if (!state.isConnected) {
      dispatch({ type: 'set', field: 'isPaused', value: false });
    }
  }, [state.isConnected]);

  return (
    <DataSourceContext.Provider value={state}>
      {children}
    </DataSourceContext.Provider>
  );
};

export default DataSourceContextProvider;
