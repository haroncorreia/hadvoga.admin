import { Notify } from 'quasar';

const show = (message, type = 'negative', timeout, position = 'top-right') => {
  Notify.create({
    message: message,
    type: type,
    multiLine: true,
    timeout: timeout || (message.length > 300 ? 7000 : message.length > 150 ? 3500 : 2000),
    position: position
  });
}

export const notify = {
  show: show,
  success: (message, timeout) => show(message, 'positive', timeout),
  error: (message, timeout) => show(message, 'negative', timeout),
  warning: (message, timeout) => show(message, 'warning', timeout),
  info: (message, timeout) => show(message, 'info', timeout)
};
