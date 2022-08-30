import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { TabList } from 'components/tabs/Tab';
import getLastElementOfPath from 'components/tabs/getLastElementOfPath';
import { TabInk } from 'model';

export default ({ items }: { items: TabList }) => {
  const location = useLocation();
  const pathEl = getLastElementOfPath();
  const pathWithoutTab = location.pathname.split('/').slice(0, -1).join('/');
  const [inkStyle, setInkStyle] = useState<TabInk[]>([]);

  useEffect(() => {
    const list = document.querySelectorAll('.tabmenuitem-getwidth');
    list.forEach(({ id, clientWidth }) =>
      setInkStyle((prevState) => [
        ...prevState,
        {
          path: id,
          width: clientWidth.toString() + 'px',
          left:
            prevState.length > 0
              ? prevState
                  .reduce(
                    (prev, curr) => prev + +curr.width.replace('px', ''),
                    0,
                  )
                  .toString() + 'px'
              : '0px',
        },
      ]),
    );
  }, []);

  return (
    <div className="p-tabmenu p-component">
      <ul className="p-tabmenu-nav p-reset">
        {items.tabs.map(({ path, label }) => (
          <Link to={`${pathWithoutTab}/${path}`} key={path}>
            <li
              className={`p-tabmenuitem tabmenuitem-getwidth ${
                (path === pathEl && 'p-highlight') || ''
              } `}
              key={path}
              id={path}
            >
              <div className="p-menuitem-link">
                <span className="p-menuitem-text">{label}</span>
              </div>
            </li>
          </Link>
        ))}
        <li
          className="p-tabmenu-ink-bar"
          style={inkStyle.find((item) => item.path === pathEl)}
        />
      </ul>
    </div>
  );
};
