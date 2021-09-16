import React from 'react';
import cl from 'classnames';
import { observer } from 'mobx-react-lite';
import { store } from 'store';
import { cutString } from 'utils/helpers';
import s from './Assets.module.scss';
import { Loading } from 'components';

const Assets = observer(({ className }: { className: string }) => {
  const { fundsByWallet, pools, currentWalletId, loadings } = store;
  const funds = fundsByWallet[currentWalletId] || [];

  return (
    <div className={cl(s.root, className)}>
      <h2 className={s.title}>Assets{loadings.assets ? <Loading /> : null}</h2>
      {[funds, pools].map((assets, i) => (
        <table className={s.table} key={i}>
          <caption>{i === 0 ? 'Funds' : 'Pools'}</caption>
          <thead>
            <tr>
              <th>Currency Symbol</th>
              <th>Token Name</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, i) => (
              <tr key={i}>
                <td>{cutString(asset.currencySymbol)}</td>
                <td>{cutString(asset.tokenName)}</td>
                <td>{asset.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </div>
  );
});

export { Assets };
