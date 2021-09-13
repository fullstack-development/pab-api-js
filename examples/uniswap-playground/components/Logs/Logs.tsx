import React from 'react';
import cl from 'classnames';
import { observer } from 'mobx-react-lite';
import { store } from 'store';
import s from './Logs.module.scss';

const Logs = observer(({ className }: { className: string }) => {
  const { logs } = store;

  return (
    <div className={cl(s.root, className)}>
      <h2 className={s.title}>Logs</h2>
      <div className={s.scrollable}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>Time</th>
              <th>Type</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {logs
              .slice()
              .reverse()
              .map((log, i) => (
                <tr
                  key={i}
                  className={cl(
                    { [s.success]: log.type === 'SUCCESS' },
                    { [s.error]: log.type === 'ERROR' },
                    { [s.warning]: log.type === 'WARNING' }
                  )}
                >
                  <td>{log.time.toLocaleTimeString()}</td>
                  <td>{log.type}</td>
                  <td>
                    <pre>{log.message}</pre>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export { Logs };
