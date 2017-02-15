import React, {PropTypes, Component} from 'react';
import classnames from 'classnames';

import servicesGlyph from 'jetbrains-icons/services.svg';

import Dropdown from '../dropdown/dropdown';
import Popup from '../popup/popup';

import TrayIcon from './tray-icon';
import styles from './services.css';

export default class Services extends Component {
  static propTypes = {
    className: PropTypes.string,
    clientId: PropTypes.string,
    loading: PropTypes.bool,
    onClick: PropTypes.func,
    services: PropTypes.arrayOf(PropTypes.shape({
      applicationName: PropTypes.string,
      iconUrl: PropTypes.string,
      homeUrl: PropTypes.string,
      name: PropTypes.string
    }))
  };

  static Link = props => {
    // eslint-disable-next-line react/prop-types
    const {service, isActive, ...restProps} = props;

    const linkProps = {
      target: '_self',
      href: service.homeUrl
    };

    const tagProps = isActive ? restProps : {...linkProps, ...restProps};

    return (
      <a {...tagProps}>
        {service.iconUrl && (
          <span
            className={styles.itemLogo}
            style={{backgroundImage: `url(${service.iconUrl})`}}
          />
        )}
        {service.iconUrl && (
          <span className={styles.itemText}>{service.name}</span>
        )}
        {!service.iconUrl && service.name}
      </a>
    );
  }

  static sort = (a, b) => {
    const aApplicationName = a.applicationName || '';
    const bApplicationName = b.applicationName || '';

    return aApplicationName.localeCompare(bApplicationName) ||
      a.name.localeCompare(b.name);
  }

  serviceIsActive = service => service.id === this.props.clientId

  render() {
    const {className, loading, onClick, services} = this.props;

    const classes = classnames(className, {
      [styles.activeIcon]: loading,
      ['ring-icon_loading']: loading
    });

    if (!services) {
      return (
        <TrayIcon
          className={classes}
          glyph={servicesGlyph}
          onClick={onClick}
        />
      );
    }

    const sortedServices = services.sort(Services.sort);
    const servicesWithIcons = sortedServices.filter(service => service.iconUrl);
    const servicesWithOutIcons = sortedServices.filter(service => !service.iconUrl);
    const separatorIsRequired = servicesWithIcons.length !== 0 && servicesWithOutIcons.length !== 0;
    const anchor = ({active}) => (
      <TrayIcon
        className={classnames({[styles.activeIcon]: active})}
        glyph={servicesGlyph}
      />
    );

    return (
      <Dropdown
        anchor={anchor}
        className={className}
        initShown={true}
      >
        <Popup className={styles.services}>
          {servicesWithIcons.map(service => {
            const isActive = this.serviceIsActive(service);

            return (
              <Services.Link
                className={isActive ? styles.activeItem : styles.linkItem}
                isActive={isActive}
                key={service.id}
                service={service}
              />
            );
          })}
          {separatorIsRequired && (
            <div
              className={styles.line}
              key="separator"
            />
          )}
          {servicesWithOutIcons.map(service => {
            const isActive = this.serviceIsActive(service);

            return (
              <Services.Link
                className={isActive ? styles.activeStacked : styles.linkStacked}
                isActive={isActive}
                key={service.id}
                service={service}
              />
            );
          })}
        </Popup>
      </Dropdown>
    );
  }
}