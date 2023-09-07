import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell} from '@fortawesome/free-solid-svg-icons'


function NotificationsComponent({ notifications, onNotificationClick }) {
  return (
    <>
      <a className="nav-link" href="#" id="notificationsDropdown" role="button" data-toggle="dropdown">
        <FontAwesomeIcon icon={faBell} />
        {notifications && notifications.length > 0 && 
          <span className="badge badge-danger">{notifications.length}</span>}
      </a>
      <div className="dropdown-menu">
        {notifications && notifications.map(notification => (
          <a className="dropdown-item" href="#" key={notification.id} onClick={() => onNotificationClick(notification.id)} >
            {notification.message}
          </a>
        ))}
        {!notifications || notifications.length === 0 && (
          <div className="dropdown-item">No notifications</div>
        )}
      </div>
    </>
  );
}

export default NotificationsComponent;
